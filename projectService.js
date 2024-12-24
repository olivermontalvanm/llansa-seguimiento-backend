"use strict";

//const sql = require( "./sqlserver" );
const jwt = require( "jsonwebtoken" );
const config = require( "./config" );
const User = require( "./models/user" );
const Project = require( "./models/project" );
const Activity = require("./models/activity");

class ProjectService {
    constructor( ) {

    }

    async getLoggedUserProjects( userId ) {
        try {
            let result = await Project.findAll( {
                include: [{
                    model: User,
                    as: "users",
                    where: { id: userId },
                    through: { attributes: [ ] }
                },{
                    model: Activity,
                    as: "activities"
                }],
            }, { raw: true } );

            let projects = result.map( r => r.toJSON( ) );

            return projects;
        } catch ( e ) {
            console.error( e );
        }
    }
}

const authService = new ProjectService( );

module.exports = authService;
