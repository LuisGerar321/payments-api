import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

const client = createClient({
  url: redisUrl,
});

client.on("error", (err) => {
  console.error("Error to connect with Redis:", err);
});

client.on("connect", () => {
  console.log("Redis ok");
});

client.connect().catch((err) => {
  console.error("Error to start a redis connection:", err);
});

export default client;
