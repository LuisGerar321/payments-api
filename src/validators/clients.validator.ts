import Joi from "joi";

export const createClientSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().alphanum().required(),
});
