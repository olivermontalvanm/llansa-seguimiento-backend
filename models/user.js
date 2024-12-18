"use strict";

const { Sequelize, DataTypes, Model } = require( "sequelize" );

const sequelize = new Sequelize( 'Llansa_Test', "sa", "aI!hACGq5MkUt&", {
    host: "18.118.245.231",
    dialect: "mssql"
} )

class User {
    id;
    firstname;
    lastname;
    projects = [];
    
    #pascalToCamelCase(str) {
        if (!str || typeof str !== "string") return "";
        return str.charAt(0).toLowerCase() + str.slice(1);
    }
    
    mapFromSql( row ) {
        const user = new User( );
        
        for( const [ key, val ] of Object.entries( row ) ) {
            user[ this.#pascalToCamelCase( key ) ] = val;
        }

        return user;
    }
    
    getFullName( ) {
        return `${ this.firstname } ${ this.lastname }`;
    }

    /**
     * 
     * @returns {object} Plain Object
     */
    toPlain( ) {
        return Object.assign( { }, this );
    }
}

const userModel = new User( );

module.exports = userModel;
