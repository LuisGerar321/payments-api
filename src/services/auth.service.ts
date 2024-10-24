import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config";
import { IAuthClient } from "../utils/interfaces";
import Clients from "../models/clients.model";
import ErrorResponse from "../utils/errors";

const { secret, exp } = config.jwt;

const generateToken = (client: Partial<Clients>, customExp: string | null = null) => {
  const { citizenIdentityDocumentNumber, ...clientWithNoIdentity } = client;
  return jwt.sign(clientWithNoIdentity, secret, { expiresIn: customExp ?? exp });
};

export const authenticateClient = async (client: IAuthClient) => {
  const { email, citizenIdentityDocumentNumber } = client;

  const clientDB = await Clients.findOne({
    where: {
      email,
      citizenIdentityDocumentNumber,
    },
  });

  if (!clientDB)
    throw new ErrorResponse({
      code: 401,
      message: "UnAuthorized client",
      details: {},
    });

  const clientParsed = clientDB.toJSON();
  const token = generateToken(clientParsed);
  const refreshToken = generateToken(clientParsed, "3h");

  return { token, refreshToken };
};

export const verifyToken = (token: string): { valid: boolean; message?: string; decoded?: JwtPayload | string } => {
  try {
    const decoded = jwt.verify(token, secret);
    return { valid: true, decoded };
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return { valid: false, message: "Token has expired" };
    } else if (err.name === "JsonWebTokenError") {
      return { valid: false, message: "Invalid token signature" };
    } else {
      return { valid: false, message: "Invalid token" };
    }
  }
};
