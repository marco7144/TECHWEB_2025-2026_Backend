import { Sequelize } from "sequelize";
import { readFileSync } from "fs";
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
  logging: false,
  dialectOptions: dialect === "postgres" ? {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  } : {}
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

async function seedWords() {
  try {
    const count = await Word.count();
    if (count === 0) {
      const wordsUrl = new URL("./words.json", import.meta.url);
      const wordsData = JSON.parse(readFileSync(wordsUrl, "utf-8"));
      await Word.bulkCreate(wordsData.map((word: string) => ({ text: word })));
      console.log(`Database populated with ${wordsData.length} words`);
    }
  } catch (error: any) {
    console.error("Failed to seed words:", error.message);
  }
}

database.sync({ force : false })
  .then(async () => {
    console.log("Database synced successfully");
    await seedWords();
  })
  .catch((err: any) => {
    console.error("Database synchronization failed:", err.message);
  });

