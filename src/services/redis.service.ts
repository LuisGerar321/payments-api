import redis from "../redis";
import Randomstring from "randomstring";

const generateRandomToken = (): string => {
  return Randomstring.generate(6);
};

export const storeToken = async (transactionId: number): Promise<string> => {
  const token = generateRandomToken();
  try {
    await redis.setEx(token, 300, String(transactionId)); // Expiration of 300 seconds
    return token;
  } catch (err) {
    throw err;
  }
};

export const getToken = async (token: string): Promise<number | null> => {
  try {
    const tokenValid = await redis.get(token);
    return tokenValid ? Number(tokenValid) : null;
  } catch (err) {
    throw err;
  }
};
