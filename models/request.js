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
    archived: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    deliveryDue: {
        type: DataTypes.DATE
    },
    costStatus: {
        type: DataTypes.STRING,
        validate: {
            isIn: [ [ "REVISADO", "ANULADO", "CONSULTA" ] ]
        }
    },
    shoppingDateReceived: {
        type: DataTypes.TIME
    },
    shoppingStatus: {
        type: DataTypes.STRING,
        validate: {
            isIn: [[ 
                "RECIBIDO", "COTIZANDO", "APROBACION LANZAS", "ESPERA EXONERACION", 
                "ORDEN COMPRA", "CHEQUE ESPERA", "CHEQUE COMPRAS", "TRANSPORTE ESPERA",
                "BODEGA CENTRAL ENTREGADO", "FINALIZADO"
            ]]
        }
    },
    shoppingDateFinished: {
        type: DataTypes.TIME
    },
    admonStatus: {
        type: DataTypes.STRING,
        validate: {
            isIn: [[ "RECIBIDO", "CHEQUE FIRMA", "ENTREGADO" ]]
        }
    },
    finishedAt: {
        type: DataTypes.TIME,
    },
    quantity: {
        type: DataTypes.DOUBLE,
        allowNull: false
    }

}, { tableName: "Requests", timestamps: true } );

module.exports = Request;
