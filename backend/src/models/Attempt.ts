import { DataTypes, Sequelize } from "sequelize";

export function createModel(database: Sequelize) {
    database.define("Attempt", {
        id_attempt: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_user: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_sketch: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        guess: {
            type: DataTypes.STRING,
            allowNull: false
        },
        is_correct: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    })
}