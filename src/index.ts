import { setupDB } from "./database";
import { server } from "./server";

async function main() {
  try {
    await server();
    await setupDB();
  } catch (error) {
    console.error(error);
  }
}

main();
