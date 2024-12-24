"use strict";

//const sql = require( "./sqlserver" );
const jwt = require( "jsonwebtoken" );
const config = require( "./config" );
const User = require( "./models/user" );
const Project = require( "./models/project" );
const Activity = require("./models/activity");

class AuthService {
    constructor( ) {

    }

    async login( { username, password } ) {
        let user = await User.findOne( { 
            where: {
                username, password
            }
        } );

        user = user.toJSON( )

        if( !user )
            return null;

        delete user.password;

        const token = jwt.sign( user, config.jwtSecret, { expiresIn: "7d" } ); 
        
        return { ...user, token };
    }

    getLoggedUser( req ) {
        const user = req.user;

        delete user.iat;
        delete user.exp;

        return user;
    }
}

const authService = new AuthService( );

module.exports = authService;
