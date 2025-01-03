"use strict";
process.env.TZ = "UTC";

const express = require( "express" );
const cors = require( "cors" );
const config = require( "./config.js" );
const { syncDatabase } = require( "./models/index.js" );

const app = express( );

function registerControllers( ) {
    app.options( "*", cors( { credentials: true, origin: true } ) );
    app.set( "trust proxy", true );

    const AuthController = require( "./authController.js" );
    const ProjectController = require( "./projectController.js" );
    const RequestController = require( "./requestController.js" );
    const AdminController = require( "./adminController.js" );
    const CatalogController = require( "./catalogController.js" );
    const SummaryController = require( "./summaryController.js" );
    
    app.use( cors( { credentials: true, origin: true } ) );
    app.use( express.json( ) );
    app.use( "/api/v1/auth/", AuthController.router );
    app.use( "/api/v1/project/", ProjectController.router );
    app.use( "/api/v1/request/", RequestController.router );
    app.use( "/api/v1/admin/", AdminController.router );
    app.use( "/api/v1/catalog/", CatalogController.router );
    app.use( "/api/v1/summary/", SummaryController.router );
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

    process.on( "ETIMEOUT", err => {
        console.error( "process.on(ETIMEOUT): ", err );
        process.exit( );
    } );
}

function startServer( ) {
    app.listen( config.app.port, config.app.host, () => {
        process.send( "ready" );
    } );

    console.info( `Application listening at: http://localhost:${ config.app.port }`);
}

( async function main( ) {
    try {
        syncDatabase( )
        .then( ( ) => {
            registerEventHandlers( );
            registerControllers( );
            startServer( );    
        })
        .catch( err => {
            console.error( "Could not connect to database: ", err );
        } );
    } catch ( e ) {
        console.error( "Error while starting app: ", e );
    }
} )( );
