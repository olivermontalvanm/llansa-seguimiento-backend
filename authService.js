"use strict";

const sql = require( "./sqlserver" );
const jwt = require( "jsonwebtoken" );
const config = require( "./config" );
const User = require( "./models/user" );
const Project = require( "./models/project" );

class AuthService {
    constructor( ) {

    }

    async login( { username, password } ) {
        const userResult = await sql.select( `
            SELECT TOP 1 * FROM Users WHERE Username = '${ username }' AND [Password] = '${ password }'
        `);

        if( !userResult ) return null;

        let user = User.mapFromSql( userResult );

        const projectsResult = await sql.select( `
            select distinct p.* from Projects p
            join Projects_Users pu on p.Id  = pu.Project 
            join Users u on pu.[User] = u.Id
            where u.Id = ${ user.id };
        ` );

        const projects = [];

        if( Array.isArray( projectsResult ) ) {
            for( const p of projectsResult ) {
                const project = Project.mapFromSql( p ).toPlain( );

                projects.push( project );
            }
        } else {
            const project = Project.mapFromSql( projectsResult ).toPlain( );

            user.projects.push( project );
        }
    

        delete user.password;

        user = user.toPlain( );

        const token = jwt.sign( user, config.jwtSecret, { expiresIn: "7d" } );
        
        return { ...user, token };
    }

    getLoggedUser( req ) {
        const user = User.mapFromSql( req.user ).toPlain( );

        delete user.iat;
        delete user.exp;

        return user;
    }
}

const authService = new AuthService( );

module.exports = authService;
