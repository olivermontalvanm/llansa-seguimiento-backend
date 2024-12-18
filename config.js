"use strict";

const path = require( "path" );
const dotenv = require( "dotenv" );
dotenv.config( );

const config = {
    sqlConfig: {
        user: process.env.SQL_USER,
        password: process.env.SQL_PASSWORD,
        server: process.env.SQL_HOST,
        database: process.env.SQL_DATABASE,
        options: { trustServerCertificate: true, encrypt: false }    
    },
    jwtSecret: process.env.JWT_SECRET
};

module.exports = config;