import { DataTypes, Sequelize } from "sequelize";
import { createHash } from "crypto";

export function createModel(database: Sequelize) {
  database.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value: string) {
        const hash = createHash("sha256");
        this.setDataValue('password', hash.update(value).digest("hex"));
      }
    }
  });
}
