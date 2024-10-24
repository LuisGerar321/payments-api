import redis from "../redis";
import Randomstring from "randomstring";

const generateRandomToken = (): string => {
  return Randomstring.generate(6);
};

export const storeToken = async (key: string): Promise<string> => {
  const token = generateRandomToken();
  try {
    await redis.setEx(key, 300, token); // Expiration of 300 seconds
    return token;
  } catch (err) {
    throw err;
  }
};

export const getToken = async (key: string): Promise<string | null> => {
  try {
    const token = await redis.get(key);
    return token;
  } catch (err) {
    throw err;
  }
};
