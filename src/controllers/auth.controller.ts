import { Request, Response } from "express";
import ErrorResponse from "../utils/errors";
import { EStatus } from "../utils/interfaces";
import { authenticateClient } from "../services/auth.service";

export class AuthController {
  public static async handleLogin(req: Request, res: Response) {
    try {
      const { email, citizenIdentityDocumentNumber } = req.body;
      const token = await authenticateClient({ email, citizenIdentityDocumentNumber });
      res.status(200).json({
        status: EStatus.SUCCESS,
        code: 200,
        message: "Client Authenticated Successfully",
        data: token,
      });
    } catch (error) {
      AuthController.handleError(res, error);
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
