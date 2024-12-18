"use strict";

const path = require( "path" );
const dotenv = require( "dotenv" );
dotenv.config( );

const config = {
    app: {
        host: process.env.APP_HOST ?? "localhost",
        port: process.env.APP_PORT ?? 3000
    },
    sqlConfig: {
        user: process.env.SQL_USER,
        password: process.env.SQL_PASSWORD,
        server: process.env.SQL_HOST,
        database: process.env.SQL_DATABASE,
        options: { trustServerCertificate: true, encrypt: false },
        pool: {
            max: 10,
            min: 0,
            idleTimeoutMillis: 30000
        }   
    },
    jwtSecret: process.env.JWT_SECRET
};

module.exports = config;