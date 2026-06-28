import { DataTypes, Sequelize } from "sequelize";

export function createModel(database: Sequelize) {
    database.define("Word", {
        id_word: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        text: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
}