import ErrorResponse from "../utils/errors";
import sequelize from "../database";
import Transactions from "../models/transactions.model";
import { ETransactionStatus, ETransactionType, ISelfBalance, ISelfTransactions } from "../utils/interfaces";
import Clients from "../models/clients.model";
import { Mailer } from "./mailer.service";
import { getToken, storeToken } from "./redis.service";
import { pendingTransactionTemplate } from "../assets/templates";
import { Op, Transaction as SeqTransaction } from "sequelize";

export const getSelfTransactions = async (clientId: number): Promise<ISelfTransactions> => {
  try {
    const transactionSent = await Transactions.findAll({
      where: {
        senderId: clientId,
      },
      include: [
        {
          model: Clients,
          as: "recipient",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const transactionReceived = await Transactions.findAll({
      where: {
        recipientId: clientId,
      },
      include: [
        {
          model: Clients,
          as: "sender",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return { sent: transactionSent, received: transactionReceived };
  } catch (err) {
    if (err instanceof Error)
      throw new ErrorResponse({
        code: 500,
        message: "Error creating client.",
        details: {
          name: err?.name,
          message: err?.message,
          stack: err?.stack,
        },
      });

    throw new ErrorResponse({
      code: 500,
      message: "Error creating client.",
      details: err,
    });
  }
};

export const getSelfBalance = async (clientId: number): Promise<ISelfBalance> => {
  try {
    const selfBalance = await Clients.findOne({
      where: {
        id: clientId,
      },
      attributes: ["balance"],
    });

    const selfTransaction = await getSelfTransactions(clientId);
    const selfSent = selfTransaction.sent.reduce((sent, currSentTran) => {
      return sent + currSentTran.amount;
    }, 0);
    const selfReceived = selfTransaction.sent.reduce((received, currReceivedTran) => {
      return received + currReceivedTran.amount;
    }, 0);

    return {
      balance: selfBalance?.balance || 0,
      sent: selfSent,
      received: selfReceived,
    };
  } catch (err) {
    if (err instanceof Error)
      throw new ErrorResponse({
        code: 500,
        message: "Error creating client.",
        details: {
          name: err?.name,
          message: err?.message,
          stack: err?.stack,
        },
      });

    throw new ErrorResponse({
      code: 500,
      message: "Error creating client.",
      details: err,
    });
  }
};

export const createATransaction = async (
  { senderId, recipientId, type, status, amount, externalPaymentRef, description }: Partial<Transactions>,
  transaction: SeqTransaction | undefined = undefined,
): Promise<Transactions> => {
  let t = transaction ?? (await sequelize.transaction());
  try {
    let isPayTransaction = type === ETransactionType.PAY;
    let isAddTransaction = type === ETransactionType.ADD;

    const badErrCreation = {
      code: 400,
      message: "Error Creating a Pay Transaction",
    };

    const sender = await Clients.findOne({
      where: {
        id: senderId,
      },
      transaction: t,
    });

    if (!sender) {
      throw new ErrorResponse({
        ...badErrCreation,
        details: {
          name: "SenderNotFoundError",
          message: `Sender with ID ${senderId} not found.`,
          stack: {},
        },
      });
    }

    if ((sender.balance <= 0 || sender.balance < Number(amount)) && isPayTransaction) {
      throw new ErrorResponse({
        ...badErrCreation,
        details: {
          name: "InsufficientFundsError",
          message: "The sender's balance is insufficient to create a pay transaction.",
          stack: {
            senderId: sender.id,
            senderBalance: sender.balance,
            amountToSend: amount,
            differende: sender.balance - Number(amount),
          },
        },
      });
    }

    let recipientClient = null;
    if (isPayTransaction)
      recipientClient = await Clients.findOne({
        where: {
          id: recipientId,
        },
        transaction: t,
      });

    if (isPayTransaction && !recipientClient)
      throw new ErrorResponse({
        ...badErrCreation,
        details: {
          name: "Invalid recipientId",
          message: "Not client found with recipient id provided by client! Pls try with other.",
          stack: {},
        },
      });

    const newTransaction = await Transactions.create(
      { senderId, recipientId, type, status, amount, externalPaymentRef, description },
      {
        include: [
          { model: Clients, as: "sender" },
          { model: Clients, as: "recipient" },
        ],
        transaction: t,
      },
    );

    const newInnerTransaction = await Transactions.findOne({
      where: {
        id: newTransaction.id,
      },

      include: [
        { model: Clients, as: "sender" },
        { model: Clients, as: "recipient" },
      ],
      transaction: t,
    });

    if (isAddTransaction) await sender.update({ balance: sender.balance + newTransaction.amount }, { transaction: t });

    if (!isAddTransaction) {
      const mailer = Mailer.getInstance();
      const token = await storeToken(newTransaction.id);
      await mailer.sendEmail({
        to: sender?.email,
        subject: "Payments App: Confirm your transaction now!",
        html: pendingTransactionTemplate(newInnerTransaction as unknown as Transactions, token),
      });
    }

    if (transaction === undefined) await t.commit();
    return newTransaction;
  } catch (err) {
    if (transaction === undefined) await t.rollback();
    if (err instanceof ErrorResponse) throw err;

    if (err instanceof Error)
      throw new ErrorResponse({
        code: 500,
        message: "Error creating client.",
        details: {
          name: err?.name,
          message: err?.message,
          stack: err?.stack,
        },
      });

    throw new ErrorResponse({
      code: 500,
      message: "Error creating client.",
      details: err,
    });
  }
};

export const confirmATransaction = async (clientId: number, transactionId: number, token: string, transaction: SeqTransaction | undefined = undefined): Promise<number> => {
  let t = transaction ?? (await sequelize.transaction());

  try {
    const client = await Clients.findOne({
      where: {
        id: clientId,
      },
      transaction: t,
    });

    if (!client)
      throw new ErrorResponse({
        code: 400,
        message: "Not Found",
        details: {
          name: "ClientNotFoundError",
          message: `Client with ID ${clientId} not found.`,
          stack: {},
        },
      });

    const isValidToken = await getToken(token);

    if (!isValidToken || isValidToken !== transactionId)
      throw new ErrorResponse({
        code: 401,
        message: "Unauthorized",
        details: {
          name: "InvalidTokenError",
          message: `The token ${token} is invalid or has expired.`,
          stack: {},
        },
      });

    const transactionRecord = await Transactions.findOne({
      where: {
        id: isValidToken,
        senderId: clientId,
        status: ETransactionStatus.PENDING,
        type: {
          [Op.not]: ETransactionType.ADD,
        },
      },
      include: [
        {
          model: Clients,
          as: "sender",
          required: true,
        },
        {
          model: Clients,
          as: "recipient",
        },
      ],
      transaction: t,
    });

    if (!transactionRecord || !transactionRecord.sender)
      throw new ErrorResponse({
        code: 400,
        message: "Not Found",
        details: {
          name: "TransactionNotFoundError",
          message: `Transaction with ID ${isValidToken} not found, confirmed or is not related with the session's clientId.`,
          stack: {},
        },
      });

    const { sender } = transactionRecord;
    const { amount: amountToTransfer } = transactionRecord;
    const isClientFundsSufficient: boolean = sender.balance >= amountToTransfer;

    if (!isClientFundsSufficient)
      throw new ErrorResponse({
        code: 400,
        message: "Insufficient Funds",
        details: {
          name: "InsufficientFundsError",
          message: `Client does not have enough funds to transfer ${amountToTransfer}.`,
          stack: {},
        },
      });

    const isExternalPayment: boolean = transactionRecord.type === ETransactionType.EXTERNAL_PAYMENT;
    const newSenderBalance = sender.balance - amountToTransfer;

    if (isExternalPayment) {
      await sender.update({ balance: newSenderBalance }, { transaction: t });
      //TODO: Extra Steps to handle the third party payment amount (Just in the future)
      await transactionRecord.update({ status: ETransactionStatus.CONFIRMED }, { transaction: t });

      if (transaction === undefined) await t.commit();

      return newSenderBalance;
    }

    //Payment Transaction for recipient from this app
    const { recipient } = transactionRecord;

    if (!recipient) {
      throw new ErrorResponse({
        code: 400,
        message: "Recipient Not Found",
        details: {
          name: "RecipientNotFoundError",
          message: "The recipient for this transaction does not exist.",
          stack: {},
        },
      });
    }

    const newRecipientBalance = recipient.balance + amountToTransfer;
    await sender.update({ balance: newSenderBalance }, { transaction: t });
    await recipient.update({ balance: newRecipientBalance }, { transaction: t });
    await transactionRecord.update({ status: ETransactionStatus.CONFIRMED }, { transaction: t });

    if (transaction === undefined) await t.commit();

    return newSenderBalance;
  } catch (err) {
    if (transaction === undefined) await t.rollback();
    if (err instanceof ErrorResponse) throw err;

    if (err instanceof Error)
      throw new ErrorResponse({
        code: 500,
        message: "Error creating client.",
        details: {
          name: err?.name,
          message: err?.message,
          stack: err?.stack,
        },
      });

    throw new ErrorResponse({
      code: 500,
      message: "Error creating client.",
      details: err,
    });
  }
};

export const findTransactionsById = async () => {
  try {
  } catch (err) {
    throw new ErrorResponse({
      code: 500,
      message: "Error retrieving clients.",
      details: err,
    });
  }
};
