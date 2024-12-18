"use strict";

const { Router } = require("express");
const Joi = require( "joi" );
const sql = require( "./sqlserver.js" );
const jwt = require( "jsonwebtoken" );
const config = require( "./config.js" );

class AuthController {
    constructor( ) {
        this.router = new Router( );

        this.router.post( "/login", [ ], this.postLogin.bind( this ) );
        this.router.post( "/test", [ this.hasToken.bind( this ) ], this.jwtTest.bind( this ) );
    }

    async hasToken( req, res, next ) {
        const unauthorized = ( ) => res.status( 401 ).json( { error: "Unauthorized" } );

        try {
            if( !req.headers.authorization ) return unauthorized( );
    
            let [ , token ] = req.headers.authorization.split( "Bearer " );
            token = String( token ).trim( );
    
            if( !token ) return unauthorized( );
    
            const user = jwt.verify( String( token ).trim( ), config.jwtSecret );

            if( !user ) unauthorized( );

            req.user = user;
            
            return next( );
        } catch ( err ) {
            console.error( "isCrmAuthenticated; catch:", err );
            return unauthorized( );
        }    
    }

    async postLogin( req, res ) {
        try {
            if( !req?.body ) return res.status( 400 ).json( { message: "Bad Request" } );
            
            const joiSchema = Joi.object( {
                username: Joi.string( ).required( ),
                password: Joi.string( ).required( )
            } );

            const { error, value } = joiSchema.validate( req.body, { allowUnknown: false } );

            if( error ) {
                console.error( error );
                return res.status( 400 ).json( { message: "Bad Request" } );
            }

            const user = await sql.select( "select * from users where username = 'olimon'" );

            const token = jwt.sign( user[ 0 ], config.jwtSecret, { expiresIn: "7d" } );
            
            return res.status( 200 ).json( { access_token: token } );
        } catch ( e ) {
            console.error( e );

            return res.status( 500 ).json( { message: "Internal server error" } );
        }
    }

    async jwtTest( req, res ) {
        console.debug( { reqUser: req.user } );

        return res.status( 200 ).json( { message: "OK" } );
    }
}

module.exports = new AuthController();
