import { Router } from "express";
import { validateBodyMiddleware } from "../middleware";
// import { TransactionsController } from "../controllers/transactions.controller";
import { createTransactionSchema } from "../validators/transactions.validator";

const TransactionsRouter = Router();

// TransactionsRouter.get("/", TransactionsController.handleGetAll);

TransactionsRouter.post("/", validateBodyMiddleware(createTransactionSchema));

export default TransactionsRouter;
