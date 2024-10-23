import { Router } from "express";
import { validateBodyMiddleware } from "../middleware";
import { createTransactionSchema } from "../validators/transactions.validator";
import { TransactionsController } from "../controllers/transactions.controller";

const TransactionsRouter = Router();

TransactionsRouter.post("/", validateBodyMiddleware(createTransactionSchema), TransactionsController.handleCreate);

export default TransactionsRouter;
