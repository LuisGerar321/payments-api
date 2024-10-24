import redis from "../redis";
import Randomstring from "randomstring";

const generateRandomToken = (): string => {
  return Randomstring.generate(6);
};

export const storeToken = async (key: string): Promise<string> => {
  const token = generateRandomToken();
  try {
    await redis.setEx(key, 300, token); // Expiration of 300 seconds
    console.log(`Token ${token} stored with key ${key}`);
    return token;
  } catch (err) {
    console.error("Error storing token:", err);
    throw err;
  }
};

export const getToken = async (key: string): Promise<string | null> => {
  try {
    const token = await redis.get(key);
    if (token) {
      console.log(`Token retrieved for key ${key}: ${token}`);
    } else {
      console.log(`No token found for key ${key}`);
    }
    return token;
  } catch (err) {
    console.error("Error retrieving token from Redis:", err);
    throw err;
  }
};
