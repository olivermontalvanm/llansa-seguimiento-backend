"use strict";

const { Router } = require("express");
const Joi = require( "joi" );
const RequestService = require( "./requestService.js" );
const { hasToken } = require( "./policies.js" );

class RequestController {
    constructor( ) {
        this.router = new Router( );

        this.router.get( "/getRequests", [ hasToken ], this.getRequests.bind( this ) );
    }

    async getRequests( req, res ) {
        try {
            const joiSchema = Joi.object( {
                status: Joi.string( ).valid( "pending" ).required( )
            } );

            const { error, value: { status } } = joiSchema.validate( req.query, { allowUnknown: false } );

            if( error ) {
                console.error( error );
                return res.status( 400 ).json( { message: "Bad Request" } );
            }


            const requests = await RequestService.getRequests( status );

            if( !requests ) throw new Error( "Could not get requests" );

            return res.status( 200 ).json( requests );
        } catch ( e ) {
            console.error( e );
            return res.status( 500 ).json( { message: "Internal server error" } );
        }
    }
}

module.exports = new RequestController();
