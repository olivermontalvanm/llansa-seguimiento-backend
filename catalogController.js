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
        this.router.get( "/items", [ hasToken ], this.getAllItemOptions.bind( this ) );
        this.router.get( "/measureUnits", [ hasToken ], this.getAllMeasureUnitOptions.bind( this ) );
        this.router.get( "/shoppingAnalists", [ hasToken ], this.getAllShoppingAnalists.bind( this ) );
    }

    async getAllProjectOptions( req, res ) {
        try {
            if( !req.user ) return res.status( 401 ).json( { message: "Unauthorized" } );
            
            const projects = await CatalogService.getAllProjectOptions( req.user );

            if( !projects ) throw new Error( "Could not get projects" );

            return res.status( 200 ).json( projects );
        } catch ( e ) {
            console.error( e );
            return res.status( 500 ).json( { message: "Internal server error" } );
        }
    }

    async getAllItemOptions( req, res ) {
        try {
            if( !req.user ) return res.status( 401 ).json( { message: "Unauthorized" } );
            
            const items = await CatalogService.getAllItemOptions( );

            if( !items ) throw new Error( "Could not get items" );

            return res.status( 200 ).json( items );
        } catch ( e ) {
            console.error( e );
            return res.status( 500 ).json( { message: "Internal server error" } );
        }
    }

    async getAllMeasureUnitOptions( req, res ) {
        try {
            if( !req.user ) return res.status( 401 ).json( { message: "Unauthorized" } );
            
            const measures = await CatalogService.getAllMeasureUnitOptions( );

            if( !measures ) throw new Error( "Could not get items" );

            return res.status( 200 ).json( measures );
        } catch ( e ) {
            console.error( e );
            return res.status( 500 ).json( { message: "Internal server error" } );
        }
    }

    async getAllShoppingAnalists( req, res ) {
        try {
            if( !req.user ) return res.status( 401 ).json( { message: "Unauthorized" } );
            
            const analists = await CatalogService.getAllShoppingAnalists( );

            if( !analists ) throw new Error( "Could not get shopping analists" );

            return res.status( 200 ).json( analists );
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
