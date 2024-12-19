"use strict";

const { DataTypes } = require( "sequelize" );
const sequelize = require( "../sequelize" );

const User = sequelize.define( "User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [ [
                "Administrador de Proyecto",
                "ITS",
                "Jefe de Compras",
                "Analista de Compras",
                "Gerente",
                "Administrador"
            ] ]
        }
    },
    forgotPassword: {
        type: DataTypes.BOOLEAN,
    },
    canResetPassword: {
        type: DataTypes.BOOLEAN,
    }
}, { tableName: "Users", timestamps: true } );

module.exports = User;
