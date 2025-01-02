"use strict";

//const sql = require( "./sqlserver" );
const jwt = require( "jsonwebtoken" );
const config = require( "./config" );
const User = require( "./models/user" );
const Project = require( "./models/project" );
const Activity = require("./models/activity");
const Request = require("./models/request");
const Item = require("./models/item");
const { Op } = require("sequelize")

class RequestService {
    constructor( ) {

    }

    async getRequests( status ) {
        try {
            /*let result = await RequestItem.findAll( {
                include: [
                    {
                        model: Item,
                        as: "item"
                    },
                    {
                        model: User,
                        as: "user"
                    },
                    {
                        model: Request,
                        as: "request"
                    },
                    {
                        model: Activity,
                        as: "activity",
                        include: {
                            model: Project,
                            as: "projectActivities"
                        }
                    }
                ]
            }, { raw: true } );*/


            let result = await Request.findAll( { } );

            let projects = result.map( r => r.toJSON( ) );

            return projects;
        } catch ( e ) {
            console.error( e );
        }
    }
}

const requestService = new RequestService( );

module.exports = requestService;
