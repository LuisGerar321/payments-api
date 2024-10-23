import { Request, Response } from "express";
import { createAClient, findAllClients } from "../services/clients.service";
import ErrorResponse from "../utils/errors";

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
      const { name, email, phone } = req.body;
      const clients = await createAClient(name, email, phone);
      res.status(201).send(clients);
    } catch (error) {
      ClientsController.handleError(res, error);
    }
  }

  private static handleError(res: Response, error: any) {
    if (error instanceof ErrorResponse) {
      const { status, message, details } = error;
      return res.status(status).json({
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
