import { DataTypes, Sequelize } from "sequelize";
import { createHash } from "crypto";

export function createModel(database: Sequelize) {
  database.define('User', {
    id_user: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    /*email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },*/
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
