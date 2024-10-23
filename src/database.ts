import { rejects } from "assert";
import { config } from "./config";
import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import { error } from "console";
const { db: dbConfig } = config;

const sequelize = new Sequelize({
  ...dbConfig,
  // logging: false,
  models: [__dirname + "/models"],
});

export const setupDB = async (force = false): Promise<void> => {
  return new Promise((resolve, reject) => {
    sequelize
      .authenticate()
      .then(() => {
        sequelize
          .sync({ force })
          .then(() => {
            console.info("DB connected sucessfully.");
            resolve();
          })
          .catch((error) => {
            console.log(`DB was not connected sucessfully: ${error}`);
            reject(error);
          });
      })
      .catch((err) => {
        console.error(`DB bad credentials:  ${err}`);
        reject(err);
      });
  });
};
export default sequelize;
