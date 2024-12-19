"use strict";

const { DataTypes } = require( "sequelize" );
const sequelize = require( "../sequelize" );

const Project = sequelize.define( "Project", {
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
}, { tableName: "Projects", timestamps: true } );

module.exports = Project;
