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

const isPostgres = dialect === "postgres";
const useSsl = isPostgres && (
  process.env.DB_SSL === "true" ||
  (process.env.NODE_ENV === "production" && process.env.DB_SSL !== "false")
);

export const database = new Sequelize(dbUri, {
  dialect: dialect,
  logging: false,
  dialectOptions: useSsl ? {
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

async function syncDatabase(retries = 10, delayMs = 2000): Promise<void> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await database.authenticate();
      await database.sync({ force: false });
      console.log("Database synced successfully");
      await seedWords();
      return;
    } catch (err: any) {
      console.error(`Database connection/sync attempt ${attempt}/${retries} failed:`, err.message);
      if (attempt < retries) {
        console.log(`Retrying database sync in ${delayMs / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      } else {
        console.error("Database synchronization failed after maximum retries.");
      }
    }
  }
}

syncDatabase();


