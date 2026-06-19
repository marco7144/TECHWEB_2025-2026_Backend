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
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
                max: 10
            }
        },
        is_won: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    })
}