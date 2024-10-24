import ErrorResponse from "../utils/errors";
import sequelize from "../database";
import Transactions from "../models/transactions.model";
import { ETransactionType } from "../utils/interfaces";
import Clients from "../models/clients.model";

export const createATransaction = async (
  { senderId, recipientId, type, status, amount, externalPaymentRef, description }: Partial<Transactions>,
  transaction = undefined,
): Promise<Transactions | void> => {
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

    const newTransaction = await Transactions.create({ senderId, recipientId, type, status, amount, externalPaymentRef, description }, { transaction: t });

    if (isAddTransaction) await sender.update({ balance: sender.balance + newTransaction.amount }, { transaction: t });

    if (transaction === undefined) await t.commit();
    return newTransaction;
  } catch (err) {
    console.log(err);
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
