"use strict";
process.env.TZ = "UTC";

const express = require( "express" );
const cors = require( "cors" );

const app = express( );
app.options( "*", cors( { credentials: true, origin: true } ) );
app.use( cors( { credentials: true, origin: true } ) );
app.set( "trust proxy", true );

async function main( ) {
    const AuthController = require( "./authController.js" );
    
    app.use( express.json( ) );
    
    app.use( "/api/v1/auth/", AuthController.router );

    startServer( );
}

function startServer( ) {
    process.on( "uncaughtException", err => {
        console.error( "process.on(uncaughexception): ", err );
        process.exit( 86 );
    } );

    app.listen( 3000, "localhost", () => {} );

    console.info( "Started app at: http://localhost:3000")
}

main( );