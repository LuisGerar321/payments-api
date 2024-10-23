import { Router } from "express";
import { validateBodyMiddleware } from "../middleware";
import { ClientsController } from "../controllers/clients.controller";
import { createClientSchema } from "../validators/clients.validator";

const ClientsRouter = Router();

ClientsRouter.get("/", ClientsController.handleGetAll);
ClientsRouter.post("/", validateBodyMiddleware(createClientSchema), ClientsController.handleCreate);

export default ClientsRouter;
