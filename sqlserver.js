"use strict";

const sql = require( "mssql" );
const config = require( "./config" );

class SQLServerDriver {
    #pool;
    #config;
    
    constructor( ) {
        this.#config = config.sqlConfig;
    }

    async #connect( ) { this.#pool = await sql.connect( this.#config ); }

    async select( query ) {
        try {
            if( !this.#pool ) await this.#connect( );
            
            if( this.#pool ) {
                let result = await this.#pool.request( ).query( query );

                if( result.recordset.length > 1 )
                    return [ ...result.recordset ];

                if( result.recordset.length == 1 ) 
                    return { ...result.recordset[ 0 ] };

                return null;
            } else {
                throw new Error( "Could not reconnect to database" );
            }
        } catch ( e ) {
            console.error( e );
            return null;
        }
    }
}

module.exports = new SQLServerDriver( );
