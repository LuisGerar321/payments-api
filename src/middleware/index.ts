import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import ErrorResponse from "../utils/errors";
import { verifyToken } from "../services/auth.service";
import { IRequest } from "../utils/interfaces";
import { JwtPayload } from "jsonwebtoken";

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
    req.body = isValidate.value;
    next();
  };
};

export const validateTokenMiddleware = async (req: IRequest, res: Response, next: NextFunction): Promise<any> => {
  try {
    const authHeader = req.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).send(
        new ErrorResponse({
          code: 401,
          message: "Bad Request.",
          details: "Authorization header is missing or improperly formatted.",
        }),
      );
    }

    const token = authHeader.split(" ")[1];
    const isToken = await verifyToken(token);
    if (!isToken.valid) {
      return res.status(401).send(
        new ErrorResponse({
          code: 401,
          message: "UnAuthorized",
          details: `${isToken.message}`,
        }),
      );
    }

    const clientInfo = isToken?.decoded as JwtPayload;

    req.session = {
      clientId: clientInfo.id,
    };

    next();
  } catch (error) {
    return res.status(500).send(
      new ErrorResponse({
        code: 500,
        message: "Internal Server Error",
        details: "An unexpected error occurs when tried to validate token.",
      }),
    );
  }
};
