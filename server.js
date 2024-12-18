"use strict";
process.env.TZ = "UTC";

const express = require( "express" );
const cors = require( "cors" );
const sql = require( "mssql" );
const config = require( "./config.js" );

const pool = new sql.ConnectionPool( config.sqlConfig );

const app = express( );

function registerControllers( ) {
    app.options( "*", cors( { credentials: true, origin: true } ) );
    app.set( "trust proxy", true );

    const AuthController = require( "./authController.js" );
    
    app.use( cors( { credentials: true, origin: true } ) );
    app.use( express.json( ) );
    app.use( "/api/v1/auth/", AuthController.router );
}

function registerEventHandlers( ) {
    process.on( "uncaughtException", err => {
        console.error( "process.on(uncaughexception): ", err );
        process.exit( );    
    } );

    process.on( "SIGINT", err => {
        console.error( "process.on(SIGINT): ", err );
        process.exit( );
    } );
}

function startServer( ) {
    app.listen( config.app.port, config.app.host, () => {
        process.send( "ready" );
    } );

    console.info( `Started app at: http://localhost:${ config.app.port }`);
}

( async function main( ) {
    try {
        pool.connect( )
        .then( pool => {
            app.locals.db = pool;
            
            registerEventHandlers( );
            registerControllers( );
            startServer( );    
        })
        .catch( err => {
            console.error( "SQL Database connection failed: ", err );
            process.exit( )
        });
    } catch ( e ) {
        console.error( "Error while starting app: ", e );
    }
} )( );
