"use strict";

const { Router } = require("express");
const Joi = require( "joi" );
const RequestService = require( "./requestService.js" );
const { hasToken } = require( "./policies.js" );
const mailService = require("./mailService.js");

class RequestController {
    constructor( ) {
        this.router = new Router( );

        this.router.get( "/getRequests", [ hasToken ], this.getRequests.bind( this ) );
        this.router.post( "/createRequest", [ hasToken ], this.postCreateRequest.bind( this ) );
        this.router.patch( "/updateCostStatus", [ hasToken ], this.patchCostStatus.bind( this ) );
        this.router.patch( "/shoppingAssignRequest", [ hasToken ], this.patchShoppingAssignee.bind( this ) );
    }

    async getRequests( req, res ) {
        try {
            const joiSchema = Joi.object( {
                page: Joi.number( ).default( 1 ).min( 1 ),
                itemsPerPage: Joi.number( ).default( 20 ).min( 5 )
            } );

            const { error, value: { page, itemsPerPage } } = joiSchema.validate( req.query, { allowUnknown: false } );

            if( error ) {
                console.error( error );
                return res.status( 400 ).json( { message: "Bad Request" } );
            }

            const { userRole: { title: userRole }, id: userId } = req.user;

            const requests = await RequestService.getRequests( page, itemsPerPage, userId, userRole );

            if( !requests ) throw new Error( "Could not get requests" );

            return res.status( 200 ).json( requests );
        } catch ( e ) {
            console.error( e );
            return res.status( 500 ).json( { message: "Internal server error" } );
        }
    }

    async patchCostStatus( req, res ) {
        try {
            const joiSchema = Joi.object( {
                id: Joi.number( ).required( ),
                status: Joi.string( ).allow( null ).empty( ).required( )
            } );

            const { error, value: { id, status } } = joiSchema.validate( req.body, { allowUnknown: false } );

            if( error ) {
                console.error( error );
                return res.status( 400 ).json( { message: "Bad Request" } );
            }

            const request = await RequestService.patchCostStatus( id, status );

            if( !request ) throw new Error( "Could not patch request" );

            return res.status( 200 ).json( request );
        } catch ( e ) {
            console.error( e );
            return res.status( 500 ).json( { message: "Internal server error" } );
        }
    }

    async patchShoppingAssignee( req, res ) {
        try {
            const joiSchema = Joi.object( {
                requestId: Joi.number( ).required( ),
                userId: Joi.number( ).allow( null ).required( )
            } );

            const { error, value: { requestId, userId } } = joiSchema.validate( req.body, { allowUnknown: false } );

            if( error ) {
                console.error( error );
                return res.status( 400 ).json( { message: "Bad Request" } );
            }

            const request = await RequestService.patchShoppingAssignee( requestId, userId );

            if( !request ) throw new Error( "Could not assign request" );

            return res.status( 200 ).json( request );
        } catch ( e ) {
            console.error( e );
            return res.status( 500 ).json( { message: "Internal server error" } );
        }
    }

    async postCreateRequest( req, res ) {
        try {
            const joiSchema = Joi.object( {
                project: Joi.object( {
                    id: Joi.number( ).required( ),
                    title: Joi.string( ).required( )
                } ).required( ),
                activity: Joi.string( ).empty( ).required( ),
                item: Joi.string( ).empty( ).required( ),
                quantity: Joi.number( ).required( ),
                measureUnit: Joi.string( ).empty( ).required( )
            } );

            const { error, value: { project, activity, item, quantity, measureUnit } } = joiSchema.validate( req.body, { allowUnknown: false } );

            if( error ) {
                console.error( error );
                return res.status( 400 ).json( { message: "Bad Request" } );
            }

            const request = await RequestService.createRequest( { project, activity, item, quantity, measureUnit }, req.user.id );

            if( !request ) throw new Error( "Could not create request" );

            //mailService.sendMail( `Tiene un nuevo pedido de ${ quantity } ${ measureUnit } de ${ item }` );

            return res.status( 200 ).json( request );
        } catch ( e ) {
            console.error( e );
            return res.status( 500 ).json( { message: "Internal server error" } );
        }
    }
}

module.exports = new RequestController();
