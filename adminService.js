"use strict";

//const sql = require( "./sqlserver" );
const jwt = require( "jsonwebtoken" );
const config = require( "./config" );
const User = require( "./models/user" );
const Project = require( "./models/project" );
const Activity = require("./models/activity");
const Request = require("./models/request");
const RequestItem = require("./models/requestItems");
const Item = require("./models/item");
const Role = require("./models/role");
const { Op } = require("sequelize")

class AdminService {
    constructor( ) {

    }

    async getUsers( currentUserId ) {
        try {
            let result = await User.findAll( {
                where: {
                    id: { [ Op.not ]: currentUserId }
                },
                include: [
                    {
                        model: Role,
                        as: "userRole"
                    },
                    {
                        model: Project,
                        as: "projects"
                    }
                ]
            }, { raw: true } );

            let users = result.map( r => r.toJSON( ) );

            return users;
        } catch ( e ) {
            console.error( e );
        }
    }
}

const requestService = new AdminService( );

module.exports = requestService;
