import Joi from "joi";
import { ETransactionStatus, ETransactionType } from "../utils/interfaces";

export const createTransactionSchema = Joi.object({
  senderId: Joi.number().required(),
  type: Joi.string()
    .valid(...Object.values(ETransactionType))
    .required(),
  recipientId: Joi.number().when("type", {
    is: ETransactionType.PAY,
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),
  externalPaymentRef: Joi.string().when("type", {
    is: ETransactionType.EXTERNAL_PAYMENT,
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),
  amount: Joi.number().greater(0).max(10000).required(),
  status: Joi.string().when("type", {
    is: ETransactionType.ADD,
    then: Joi.valid(ETransactionStatus.CONFIRMED).default(ETransactionStatus.CONFIRMED),
    otherwise: Joi.valid(ETransactionStatus.PENDING).default(ETransactionStatus.PENDING),
  }),
  description: Joi.string().optional(),
});

export const confirmTransactionSchema = Joi.object({
  token: Joi.string().min(6).max(6).required(),
});
