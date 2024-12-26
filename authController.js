"use strict";

const { Router } = require("express");
const Joi = require( "joi" );
const AuthService = require( "./authService.js" );
const { hasToken } = require( "./policies.js" );

class AuthController {
    constructor( ) {
        this.router = new Router( );

        this.router.post( "/login", [ ], this.postLogin.bind( this ) );
        this.router.post( "/logout", [ hasToken ], this.postLogout.bind( this ) );
        this.router.get( "/loggedUser", [ hasToken ], this.getLoggedUser.bind( this ) );
    }

    async getLoggedUser( req, res ) {
        try {
            const user = AuthService.getLoggedUser( req );

            if( !user ) throw new Error( "Could not get logged user" );

            return res.status( 200 ).json( user );
        } catch ( e ) {
            console.error( e );
            return res.status( 500 ).json( { message: "Internal server error" } );
        }
    }

    async postLogin( req, res ) {
        try {
            if( !req?.body ) return res.status( 400 ).json( { message: "Bad Request" } );
            
            const joiSchema = Joi.object( {
                username: Joi.string( ).required( ),
                password: Joi.string( ).required( )
            } );

            const { error, value: { username, password } } = joiSchema.validate( req.body, { allowUnknown: false } );

            if( error ) {
                console.error( error );
                return res.status( 400 ).json( { message: "Bad Request" } );
            }

            let userAndToken;

            const passwordRenewalUser = await AuthService.shouldRenewPassword( { username } );

            if( passwordRenewalUser ) {
                userAndToken = await AuthService.renewPassword( passwordRenewalUser, password );
            } else {
                userAndToken = await AuthService.login( { username, password } );
            }

            if( !userAndToken ) return res.status( 401 ).json( { message: "Unauthorized" } );
            
            return res.status( 200 ).json( { ...userAndToken } );
        } catch ( e ) {
            console.error( e );

            return res.status( 500 ).json( { message: "Internal server error" } );
        }
    }

    async postLogout( _, res ) {
        try {
            return res.status( 200 ).json( {} );
        } catch ( e ) {
            console.error( e );
            return res.status( 500 ).json( { message: "Internal server error" } );
        }
    }
}

module.exports = new AuthController();
