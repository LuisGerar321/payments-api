import Joi from "joi";

export const createClientSchema = Joi.object({
  email: Joi.string().email().required(),
  body: Joi.string().required(),
  replyToId: Joi.number().optional().allow("null"),
});
