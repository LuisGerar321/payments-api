import { Router } from "express";
import { validateBodyMiddleware, validateTokenMiddleware } from "../middleware";
import { confirmTransactionSchema, createTransactionSchema } from "../validators/transactions.validator";
import { TransactionsController } from "../controllers/transactions.controller";

const TransactionsRouter = Router();

TransactionsRouter.post("/", validateTokenMiddleware, validateBodyMiddleware(createTransactionSchema), TransactionsController.handleCreate);
TransactionsRouter.patch("/", validateTokenMiddleware, validateBodyMiddleware(confirmTransactionSchema), TransactionsController.handleConfirm);

export default TransactionsRouter;
