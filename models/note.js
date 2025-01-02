"use strict";

const { DataTypes } = require( "sequelize" );
const sequelize = require( "../sequelize" );

const Note = sequelize.define( "Notes", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { tableName: "Notes", timestamps: true } );

module.exports = Note;
