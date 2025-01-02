"use strict";

//const sql = require( "./sqlserver" );
const jwt = require( "jsonwebtoken" );
const config = require( "./config" );
const User = require( "./models/user" );
const Project = require( "./models/project" );
const Activity = require("./models/activity");
const Request = require("./models/request");
const Item = require("./models/item");
const Role = require("./models/role");
const { Op } = require("sequelize");
const ProjectService = require( "./projectService" );
const sequelize = require("./sequelize");

class SummaryService {
    constructor( ) {

    }

    async getUsers( currentUserId, page, itemsPerPage, nameFilter, excludeSelfUser ) {
        try {
            const query = {
                include: [
                    { model: Role, as: "userRole" },
                    { model: Project, as: "projects" }
                ],
                offset: ( page - 1 ) * itemsPerPage,
                limit: itemsPerPage
            };

            if( excludeSelfUser )
                query.where = { id: { [ Op.not ]: currentUserId } };

            let results = await sequelize.query(`
                SELECT  COUNT(*) as amount, r.title as label
                FROM Users u
                JOIN Roles r on u.roleId = r.id
                WHERE u.isActive = 1
                GROUP BY r.title;
            `, { raw: true });

            if( !results ) return null;
            
            results = results[ 0 ];
            
            return results;
        } catch ( e ) {
            console.error( e );
        }
    }
}

const summaryService = new SummaryService( );

module.exports = summaryService;
