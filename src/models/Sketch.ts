import { DataTypes, Sequelize } from "sequelize";

export function createModel(database: Sequelize) {
    database.define("Sketch", {
        id_sketch: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_user: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_word: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        path: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    })
}