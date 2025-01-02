"use strict";

const { Router } = require("express");
const Joi = require( "joi" );
const AdminService = require( "./adminService.js" );
const { hasToken } = require( "./policies.js" );

class AdminController {
    constructor( ) {
        this.router = new Router( );

        this.router.get( "/getUsers", [ hasToken ], this.getUsers.bind( this ) );
        this.router.post( "/createUser", [ hasToken ], this.postCreateUser.bind( this ) );
    }

    async getUsers( req, res ) {
        try {
            const joiSchema = Joi.object( {
                page: Joi.number( ).default( 1 ).min( 1 ),
                itemsPerPage: Joi.number( ).default( 20 ).min( 5 ),
                name: Joi.string( ).optional( ),
                project: Joi.number( ).optional( ),
                status: Joi.number( ).valid( 0, 1 ).optional( )
            } );

            const { error, value: { page, itemsPerPage, name, project, status } } = joiSchema.validate( req.query, { allowUnknown: false } );

            if( error ) {
                console.error( error );
                return res.status( 400 ).json( { message: "Bad Request" } );
            }

            let filters = null;

            if( name || project || !isNaN( status ) ) {
                filters = {};
                
                if( name ) filters.name = name;
                if( project ) filters.project = project;
                if( status !== undefined ) filters.status = status;
            }

            const requests = await AdminService.getUsers( req.user.id, page, itemsPerPage, filters, true );

            if( !requests ) throw new Error( "Could not get requests" );

            return res.status( 200 ).json( requests );
        } catch ( e ) {
            console.error( e );
            return res.status( 500 ).json( { message: "Internal server error" } );
        }
    }

    async postCreateUser( req, res ) {
        try {
            const joiSchema = Joi.object( {
                username: Joi.string( ).empty( ).required( ),
                email: Joi.string( ).email( ).empty( ).required( ),
                firstname: Joi.string( ).empty( ).required( ),
                lastname: Joi.string( ).empty( ).required( ),
                role: Joi.number( ).required( ),
                projects: Joi.array( ).items( Joi.string( ).empty( ) ),
            } );

            const { error, value: newUser } = joiSchema.validate( req.body, { allowUnknown: false } );

            if( error ) {
                console.error( error );
                return res.status( 400 ).json( { message: "Bad Request" } );
            }

            const createdUser = await AdminService.createUser( newUser );

            if( !createdUser ) throw new Error( "Could not get requests" );

            return res.status( 200 ).json( createdUser );
        } catch ( e ) {
            console.error( e );
            return res.status( 500 ).json( { message: "Internal server error" } );
        }
    }
}

module.exports = new AdminController();
