"use strict";

const sql = require( "mssql" );
const config = require( "./config" );

class SQLServerDriver {
    #pool;
    #config;
    
    constructor( { server, user, password, database, options } ) {
        this.#config = { server, user, password, database, options };
    }

    

    async #connect( ) { this.#pool = await sql.connect( this.#config ); }

    async select( query ) {
        try {
            if( !this.#pool ) await this.#connect( );
            
            if( this.#pool ) {
                let result = await this.#pool.request( ).query( query );

                return result.recordset;
            } else {
                throw new Error( "Could not reconnect to database" );
            }
        } catch ( e ) {
            console.error( e );
        }
    }
}

const { server, password, user, database, options } = { ...config.sqlConfig };
module.exports = new SQLServerDriver( { server, user, password, database, options  } );
