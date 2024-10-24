import { Request, Response } from "express";
import ErrorResponse from "../utils/errors";
import { EStatus } from "../utils/interfaces";
import { createATransaction } from "../services/transactions.service";

export class TransactionsController {
  public static async handleCreate(req: Request, res: Response) {
    try {
      const { senderId, recipientId, type, status, amount, externalPaymentRef, description } = req.body;
      console.log(status);
      const transactions = await createATransaction({ senderId, recipientId, type, status, amount, externalPaymentRef, description });
      res.status(200).json({
        status: EStatus.SUCCESS,
        code: 200,
        message: "Transaction Created Successfully",
        data: transactions,
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
