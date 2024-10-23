import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import ErrorResponse from "../utils/errors";

export const validateBodyMiddleware = (schemaValidator: Joi.ObjectSchema<any>) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    if (schemaValidator === null) return next();
    const { body } = req;
    const isValidate = schemaValidator.validate(body);
    if (isValidate?.error) {
      return res.status(400).send(
        new ErrorResponse({
          code: 400,
          message: "Bad request in body payload.",
          details: isValidate.error.message,
        }),
      );
    }
    next();
  };
};
