"use strict";

const { Router } = require("express");
const Joi = require( "joi" );
const ProjectService = require( "./projectService.js" );
const { hasToken } = require( "./policies.js" );

class ProjectController {
    constructor( ) {
        this.router = new Router( );

        this.router.post( "/getLoggedUserProjects", [ hasToken ], this.getLoggedUserProjects.bind( this ) );
    }

    async getLoggedUserProjects( req, res ) {
        try {
            if( !req.user ) return res.status( 401 ).json( { message: "Unauthorized" } );
            
            const projects = await ProjectService.getLoggedUserProjects( req.user.id );

            if( !projects ) throw new Error( "Could not get logged user" );

            console.debug( projects );

            return res.status( 200 ).json( projects );
        } catch ( e ) {
            console.error( e );
            return res.status( 500 ).json( { message: "Internal server error" } );
        }
    }
}

module.exports = new ProjectController();
