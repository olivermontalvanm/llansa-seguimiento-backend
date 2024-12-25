"use strict";

const { Router } = require("express");
const Joi = require( "joi" );
const AdminService = require( "./adminService.js" );
const { hasToken } = require( "./policies.js" );

class AdminController {
    constructor( ) {
        this.router = new Router( );

        this.router.get( "/getUsers", [ hasToken ], this.getUsers.bind( this ) );
    }

    async getUsers( req, res ) {
        try {
            const requests = await AdminService.getUsers( req.user.id );

            if( !requests ) throw new Error( "Could not get requests" );

            return res.status( 200 ).json( requests );
        } catch ( e ) {
            console.error( e );
            return res.status( 500 ).json( { message: "Internal server error" } );
        }
    }
}

module.exports = new AdminController();
