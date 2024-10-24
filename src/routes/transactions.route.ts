import { Router } from "express";
import { validateBodyMiddleware, validateTokenMiddleware } from "../middleware";
import { createTransactionSchema } from "../validators/transactions.validator";
import { TransactionsController } from "../controllers/transactions.controller";

const TransactionsRouter = Router();

TransactionsRouter.post("/", validateTokenMiddleware, validateBodyMiddleware(createTransactionSchema), TransactionsController.handleCreate);

export default TransactionsRouter;
