"use strict";

class Project {
    id;
    title;
    
    #pascalToCamelCase(str) {
        if (!str || typeof str !== "string") return "";
        return str.charAt(0).toLowerCase() + str.slice(1);
    }
    
    mapFromSql( row ) {
        const user = new Project( );
        
        for( const [ key, val ] of Object.entries( row ) ) {
            user[ this.#pascalToCamelCase( key ) ] = val;
        }

        return user;
    }

    /**
     * 
     * @returns {object} Plain Object
     */
    toPlain( ) {
        return Object.assign( { }, this );
    }
}

const projectModel = new Project( );

module.exports = projectModel;
