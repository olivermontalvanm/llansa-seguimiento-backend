"use strict";

function mapCamelCaseProperties( o ) {
    const newObj = {};
        
    for( const [ key, val ] of Object.entries( row ) ) {
        newObj[ pascalToCamelCase( key ) ] = val;
    }

    return newObj;
}

function pascalToCamelCase(str) {
    if (!str || typeof str !== "string") return "";
    return str.charAt(0).toLowerCase() + str.slice(1);
}

module.exports = { mapCamelCaseProperties };
