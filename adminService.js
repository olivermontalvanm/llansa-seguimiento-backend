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

    async getUsers( currentUserId, page, itemsPerPage, filters, excludeSelfUser ) {
        try {
            const query = {
                offset: ( page - 1 ) * itemsPerPage,
                limit: itemsPerPage,
                where: {}
            };
            let projectWhere = {};

            if( excludeSelfUser )
                query.where = { id: { [ Op.not ]: currentUserId } };

            //  TODO Search by whole name, not just by firstname
            if( filters?.name )
                query.where = { ...query.where, firstname: { [Op.like]: `%${filters.name}%` } }

            if( filters?.project )
                projectWhere = { id: filters.project };

            if( filters?.status == 0 || filters?.status == 1 )
                query.where = { ...query.where, isActive: filters.status };


            let result = await User.findAll( { 
                ...query, 
                include: [
                    { model: Role, as: "userRole" },
                    { model: Project, as: "projects", where: projectWhere, required: true },
                ]
            }, { raw: true } );

            result = await User.findAll( {
                where: { id: { [Op.in]: result.map( r => (r.toJSON( )).id ) } },
                order: [ [ "createdAt", "DESC" ] ],
                include: [
                    { model: Role, as: "userRole" },
                    { model: Project, as: "projects" },     
                ]
            } );

            let users = result.map( r => r.toJSON( ) );

            return users;
        } catch ( e ) {
            console.error( e );
        }
    }

    async createUser( newUser ) {
        try {
            //  TODO Trim values to prevent potential bugs
            let userProjects = await Project.findAll( {
                where: { title: { [ Op.in ]: newUser.projects } }
            }, { raw: true } );

            //  Create projects that dont exist
            for( const projectLabel of newUser.projects ) {
                //  Project label provided by user does not exist in database
                if( !userProjects.map( proj => (proj.toJSON( )).title ).includes( projectLabel ) ) {
                    //  NOTE Probably should capitalize labels when comparing titles to prevent duplicates
                    const createdProject = await ProjectService.createProject( {
                        createdAt: new Date( ),
                        updatedAt: new Date( ),
                        title: projectLabel
                    } );

                    if( createdProject )
                        userProjects.push( createdProject );

                    //  TODO Handle case where project cannot be created for some reason
                }
            }

            const createdUser = await User.create({ 
                ...newUser,
                isActive: true,
                password: "",
                forgotPassword: true,
                canResetPassword: true,
                roleId: newUser.role
            }, { raw: true });

            //  TODO Handle case where user could not be created

            try {
                await createdUser.addProjects( userProjects.map( p => (p.toJSON( )).id));
                createdUser.toJSON( );
            } catch( e ) { 
                createdUser.destroy( );
                throw e;
            }

            return createdUser;
        } catch ( e ) {
            console.error( e );
            throw e;
        }
    }
}

const requestService = new AdminService( );

module.exports = requestService;
