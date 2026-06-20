import { DataTypes, Sequelize } from "sequelize";

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
      allowNull: false
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
}
