"use strict";

const { Router } = require("express");
const Joi = require( "joi" );
const CatalogService = require( "./catalogService.js" );
const { hasToken } = require( "./policies.js" );

class ProjectController {
    constructor( ) {
        this.router = new Router( );

        this.router.get( "/projects", [ hasToken ], this.getAllProjectOptions.bind( this ) );
        this.router.get( "/roles", [ hasToken ], this.getAllRoleOptions.bind( this ) );
    }

    async getAllProjectOptions( req, res ) {
        try {
            if( !req.user ) return res.status( 401 ).json( { message: "Unauthorized" } );
            
            const projects = await CatalogService.getAllProjectOptions( );

            if( !projects ) throw new Error( "Could not get logged user" );

            return res.status( 200 ).json( projects );
        } catch ( e ) {
            console.error( e );
            return res.status( 500 ).json( { message: "Internal server error" } );
        }
    }

    async getAllRoleOptions( req, res ) {
        try {
            if( !req.user ) return res.status( 401 ).json( { message: "Unauthorized" } );
            
            const roles = await CatalogService.getAllRoleOptions( );

            if( !roles ) throw new Error( "Could not get logged user" );

            return res.status( 200 ).json( roles );
        } catch ( e ) {
            console.error( e );
            return res.status( 500 ).json( { message: "Internal server error" } );
        }
    }
}

module.exports = new ProjectController();
