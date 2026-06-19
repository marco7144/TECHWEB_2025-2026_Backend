import { Sequelize } from "sequelize";
import { createModel as createUserModel } from "../models/User.js";
import { createModel as createSketchModel } from "../models/Sketch.js";
import { createModel as createAttemptModel } from "../models/Attempt.js";
import { createModel as createWordModel } from "../models/Word.js";

const dbUri = process.env.DB_CONNECTION_URI;
const dialect = process.env.DIALECT as any;

if (!dbUri) {
  throw new Error("DB_CONNECTION_URI is not defined in environment variables");
}
if (!dialect) {
  throw new Error("DIALECT is not defined in environment variables");
}

export const database = new Sequelize(dbUri, {
  dialect: dialect,
  logging: false
});

createUserModel(database);
createWordModel(database);
createSketchModel(database);
createAttemptModel(database);

export const { User, Word, Sketch, Attempt } = database.models;

Word.hasMany(Sketch, { foreignKey: "id_word" });
Sketch.belongsTo(Word, { foreignKey: "id_word" });

User.hasMany(Sketch, { foreignKey: "id_user" });
Sketch.belongsTo(User, { foreignKey: "id_user" });

User.hasMany(Attempt, { foreignKey: "id_user" });
Attempt.belongsTo(User, { foreignKey: "id_user" });

Sketch.hasMany(Attempt, { foreignKey: "id_sketch" });
Attempt.belongsTo(Sketch, { foreignKey: "id_sketch" });



database.sync({ force : true })
  .then(() => {
    console.log("Database synced successfully");
  })
  .catch((err: any) => {
    console.error("Database synchronization failed:", err.message);
  });
