import Joi from "joi";

export const authClientSchema = Joi.object({
  email: Joi.string().email().required(),
  citizenIdentityDocumentNumber: Joi.string().required(),
});
