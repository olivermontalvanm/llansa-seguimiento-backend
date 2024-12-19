"use strict";

const { DataTypes } = require( "sequelize" );
const sequelize = require( "../sequelize" );

const Request = sequelize.define( "Request", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    reqNumber: {
        type: DataTypes.STRING
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
    archived: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    approved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    finishedAt: {
        type: DataTypes.TIME,
    }
}, { tableName: "Requests", timestamps: true } );

module.exports = Request;
