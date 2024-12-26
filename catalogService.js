"use strict";

const Project = require( "./models/project" );
const Role = require("./models/role");

class ProjectService {
    constructor( ) {

    }

    async getAllProjectOptions( ) {
        try {
            let result = await Project.findAll( { }, { raw: true } );

            let projects = result.map( r => r.toJSON( ) );

            const options = projects.map( p => ( {
                id: p.id,
                label: p.title
            } ) );

            return options;
        } catch ( e ) {
            console.error( e );
        }
    }

    async getAllRoleOptions( ) {
        try {
            let result = await Role.findAll( { }, { raw: true } );

            let roles = result.map( r => r.toJSON( ) );

            const options = roles.map( p => ( {
                id: p.id,
                label: p.title
            } ) );

            return options;
        } catch ( e ) {
            console.error( e );
        }
    }
}

const authService = new ProjectService( );

module.exports = authService;
