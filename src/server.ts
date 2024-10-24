import express, { json } from "express";
import { config } from "./config";
import cors from "cors";
import ClientsRouter from "./routes/clients.route";
import TransactionsRouter from "./routes/transactions.route";
import AuthsRouter from "./routes/auth.route";

const { port, host } = config?.server;
const app = express();
app.use(cors());
app.use(json());

app.use("/clients", ClientsRouter);
app.use("/transactions", TransactionsRouter);
app.use("/auth", AuthsRouter);

export const server = async () => {
  return new Promise((resolve, reject) => {
    app.listen(port, host, () => {
      console.info(`Server running at http://${host}:${port}`);
      resolve(true);
    });
  });
};
