import express, { json } from "express";
import { config } from "./config";
import cors from "cors";
import ClientsRouter from "./routes/clients.route";
import TransactionsRouter from "./routes/transactions.route";

const { port, host } = config?.server;
const app = express();
app.use(cors());
app.use(json());

app.use("/clients", ClientsRouter);
app.use("/transactions", TransactionsRouter);

export const server = async () => {
  return new Promise((resolve, reject) => {
    app.listen(port, host, () => {
      console.info(`Server running at http://${host}:${port}`);
      resolve(true);
    });
  });
};
