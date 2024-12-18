"use strict";

const jwt = require( "jsonwebtoken" );
const config = require( "./config.js" );

async function hasToken( req, res, next ) {
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

module.exports = { hasToken };
