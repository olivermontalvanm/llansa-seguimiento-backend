"use strict";

const { Router } = require("express");
const Joi = require( "joi" );
const SummaryService = require( "./summaryService.js" );
const { hasToken } = require( "./policies.js" );

class SummaryController {
    constructor( ) {
        this.router = new Router( );

        this.router.get( "/users", [ hasToken ], this.getUsers.bind( this) );
    }

    async getUsers( _, res ) {
        try {
            const summary = await SummaryService.getUsers( );

            if( !summary ) throw new Error( "Could not get summary" );

            return res.status( 200 ).json( summary );
        } catch ( e ) {
            console.error( e );
            return res.status( 500 ).json( { message: "Internal server error" } );
        }
    }
}

module.exports = new SummaryController();
