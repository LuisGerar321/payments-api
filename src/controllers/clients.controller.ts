import { Request, Response } from "express";
import { createAClient, findAllClients } from "../services/clients.service";
import ErrorResponse from "../utils/errors";
import { EStatus } from "../utils/interfaces";

export class ClientsController {
  public static async handleGetAll(req: Request, res: Response) {
    try {
      const clients = await findAllClients();
      res.status(200).send(clients);
    } catch (error) {
      ClientsController.handleError(res, error);
    }
  }

  public static async handleCreate(req: Request, res: Response) {
    try {
      const { name, email, phone, citizenIdentityDocumentNumber } = req.body;
      const clients = await createAClient(name, email, phone, citizenIdentityDocumentNumber);
      res.status(200).json({
        status: EStatus.SUCCESS,
        code: 200,
        message: "Client Created Successfully",
        data: clients,
      });
    } catch (error) {
      ClientsController.handleError(res, error);
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
