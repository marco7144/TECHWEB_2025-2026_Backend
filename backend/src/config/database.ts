import { Sequelize } from "sequelize";
import { createModel as createUserModel } from "../models/User.js";

const dbUri = process.env.DB_CONNECTION_URI;
const dialect = process.env.DIALECT as any;

if (!dbUri) {
  throw new Error("DB_CONNECTION_URI is not defined in environment variables");
}

export const database = new Sequelize(dbUri, {
  dialect: dialect,
  logging: false
});

createUserModel(database);

export const { User } = database.models;

database.sync()
  .then(() => {
    console.log("Database synced successfully");
  })
  .catch((err: any) => {
    console.error("Database synchronization failed:", err.message);
  });
