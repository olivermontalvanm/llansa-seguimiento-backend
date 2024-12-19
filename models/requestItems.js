"use strict";

const { DataTypes } = require( "sequelize" );
const sequelize = require( "../sequelize" );

const RequestItem = sequelize.define( "RequestItem", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    quantity: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    measureUnit: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dueDate: {
        type: DataTypes.TIME
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: "CREATED",
        validate: {
            isIn: [ [
                'CREATED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'
            ] ]
        }
    },
    finishedAt: {
        type: DataTypes.TIME
    },
    shoppingStatus: {
        type: DataTypes.STRING,
        validate: {
            isIn: [[
                "En espera de cheque"
            ]]
        }
    },
    admonStatus: {
        type: DataTypes.STRING,
        validate: {
            isIn: [[
                "Recibido"
            ]]
        }
    }
}, { tableName: "RequestItems", timestamps: true } );

module.exports = RequestItem;
