import { Request, Response } from "express";
import ErrorResponse from "../utils/errors";
import { EStatus, ETransactionType, IRequest } from "../utils/interfaces";
import { confirmATransaction, createATransaction, getSelfBalance, getSelfTransactions } from "../services/transactions.service";

export class TransactionsController {
  public static async handleCreate(req: IRequest, res: Response) {
    try {
      const { clientId } = req.session;
      const { recipientId, type, status, amount, externalPaymentRef, description } = req.body;
      const isAddTransaction = type === ETransactionType.ADD;

      const transactions = await createATransaction({ senderId: clientId, recipientId: isAddTransaction ? clientId : recipientId, type, status, amount, externalPaymentRef, description });
      res.status(201).json({
        status: EStatus.SUCCESS,
        code: 201,
        message: "Transaction Created Successfully",
        data: transactions,
      });
    } catch (error) {
      TransactionsController.handleError(res, error);
    }
  }
  public static async handleGetSelfTransaction(req: IRequest, res: Response) {
    try {
      const { clientId } = req.session;
      const myTransactions = await getSelfTransactions(Number(clientId));
      res.status(200).json({
        status: EStatus.SUCCESS,
        code: 200,
        message: "Self Transaction Get Successfully",
        data: myTransactions,
      });
    } catch (error) {
      TransactionsController.handleError(res, error);
    }
  }

  public static async handleGetSelfBalance(req: IRequest, res: Response) {
    try {
      const { clientId } = req.session;
      const myBalance = await getSelfBalance(Number(clientId));
      res.status(200).json({
        status: EStatus.SUCCESS,
        code: 200,
        message: "Self Balance Get Successfully",
        data: myBalance,
      });
    } catch (error) {
      TransactionsController.handleError(res, error);
    }
  }

  public static async handleConfirm(req: IRequest, res: Response) {
    try {
      const { token } = req.body;
      const { id: transactionId } = req.params;
      const { clientId } = req.session;
      const comfirmedTransaction = await confirmATransaction(Number(clientId), Number(transactionId), token);
      res.status(200).json({
        status: EStatus.SUCCESS,
        code: 200,
        message: "Transaction Confirmed Successfully",
        data: {
          newBalance: comfirmedTransaction,
        },
      });
    } catch (error) {
      TransactionsController.handleError(res, error);
    }
  }

  private static handleError(res: Response, error: any) {
    if (error instanceof ErrorResponse) {
      const { code, message, details, status } = error;
      return res.status(code).json({
        status,
        code,
        message,
        details: details || "No additional details.",
      });
    }

    return res.status(500).send({
      message: "Internal Server Error",
      details: error.message || "No details available.",
    });
  }
}
