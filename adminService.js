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
const { Op } = require("sequelize");
const ProjectService = require( "./projectService" );

class AdminService {
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

            if( nameFilter )
                query.where = { ...query.where, firstname: { [Op.like]: `%${nameFilter}%` } }
            
            let result = await User.findAll( { ...query }, { raw: true } );

            let users = result.map( r => r.toJSON( ) );

            return users;
        } catch ( e ) {
            console.error( e );
        }
    }

    async createUser( newUser ) {
        try {
            let existingProjects = await Project.findAll( {
                where: { title: { [ Op.in ]: newUser.projects } }
            }, { raw: true } );

            for( const projectLabel of newUser.projects ) {
                if( !existingProjects.map( proj => (proj.toJSON( )).title ).includes( projectLabel ) ) {
                    const createdProject = await ProjectService.createProject( {
                        createdAt: new Date( ),
                        updatedAt: new Date( ),
                        title: projectLabel
                    } );

                    existingProjects.push( createdProject );
                }
            }

            const createdUser = await User.create({ 
                ...newUser,
                isActive: true,
                password: "",
                forgotPassword: true,
                canResetPassword: true,
                roleId: newUser.role
            });

            try {
            existingProjects.forEach( project => createdUser.addProject( project ) );
            
            createdUser.toJSON( );
            } catch( e ) { console.debug( e  ); }

            return createdUser;
        } catch ( e ) {
            console.error( e );
        }
    }
}

const requestService = new AdminService( );

module.exports = requestService;
