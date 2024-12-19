"use strict";

const { DataTypes } = require( "sequelize" );
const sequelize = require( "../sequelize" );

const Activity = sequelize.define( "Activity", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING
    }
}, { tableName: "Activities", timestamps: true } );

module.exports = Activity;
