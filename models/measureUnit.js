"use strict";

const { DataTypes } = require( "sequelize" );
const sequelize = require( "../sequelize" );

const MeasureUnit = sequelize.define( "MeasureUnit", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { tableName: "MeasureUnits", timestamps: true } );

module.exports = MeasureUnit;
