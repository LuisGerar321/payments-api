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
    let isTransactionPay = type === ETransactionType.PAY;

    let recipientClient = null;
    if (isTransactionPay)
      recipientClient = await Clients.findOne({
        where: {
          id: recipientId,
        },
        transaction: t,
      });

    if (isTransactionPay && !recipientClient)
      throw new ErrorResponse({
        code: 400,
        message: "Error Creating a  Pay Transaction",
        details: {
          name: "Invalid recipientId",
          message: "Not client found with recipient id provided by client! Pls try with other.",
          stack: {},
        },
      });

    const newTransaction = await Transactions.create({ senderId, recipientId, type, status, amount, externalPaymentRef, description }, { transaction: t });
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
