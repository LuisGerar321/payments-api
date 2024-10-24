import { Request } from "express";
import Transactions from "../models/transactions.model";

export interface IMailerSendEmail {
  to: string;
  subject: string;
  text?: string;
  html?: any;
}

export enum EStatus {
  SUCCESS = "success",
  ERROR = "error",
}

export enum ETransactionType {
  ADD = "add",
  PAY = "pay",
  EXTERNAL_PAYMENT = "external_payment",
}

export enum ETransactionStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
}

export interface IAuthClient {
  email: string;
  citizenIdentityDocumentNumber: string;
}

export interface IRequest extends Request {
  session?: any;
}

export interface ISelfTransactions {
  sent: Transactions[];
  received: Transactions[];
}
export interface ISelfBalance {
  balance: number;
  sent: number;
  received: number;
}
