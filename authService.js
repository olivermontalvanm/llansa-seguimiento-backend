"use strict";

//const sql = require( "./sqlserver" );
const jwt = require( "jsonwebtoken" );
const config = require( "./config" );
const User = require( "./models/user" );
const Project = require( "./models/project" );
const Activity = require("./models/activity");
const Role = require("./models/role");

class AuthService {
    constructor( ) {

    }

    generateToken( user ) { return jwt.sign( user, config.jwtSecret, { expiresIn: "7d" } ); }

    async shouldRenewPassword( { username } ) {
        let user = await User.findOne( {
            where: { username, canResetPassword: 1 },
            include: { model: Role, as: "userRole" }
        }, { raw: true } );

        if( !user )
            return false;

        user = user.toJSON( );
        
        return { ...user };
    }

    async login( { username, password } ) {
        let user = await User.findOne( { 
            where: {
                username, password
            },
            include: {
                model: Role,
                as: "userRole"
            }
        }, { raw: true } );

        if( !user )
            return null;

        user = user.toJSON( )

        delete user.password;

        const token = this.generateToken( user ); 
        
        return { ...user, token };
    }

    async renewPassword( renewUser, password ) {
        let user = await User.findOne( { 
            where: {
                username: renewUser.username, 
                password: renewUser.password
            },
            include: {
                model: Role,
                as: "userRole"
            }
        } );

        if( !user )
            return null;
        
        user.password = password;

        let  updatedUser = await user.save( );

        updatedUser = updatedUser.toJSON( )

        delete updatedUser.password;

        const token = this.generateToken( updatedUser ); 
        
        return { ...updatedUser, token };
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
