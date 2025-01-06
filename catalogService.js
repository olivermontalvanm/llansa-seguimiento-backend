"use strict";

const Project = require( "./models/project" );
const Role = require("./models/role");
const User = require("./models/user");
const Item = require("./models/item");
const MeasureUnit = require("./models/measureUnit");

class ProjectService {
    constructor( ) {

    }

    async getAllProjectOptions( user ) {
        try {
            const { userRole: { title: userRole }, id } = user;

            let where = {};

            //  HACK Use constant instead of literal
            if( userRole == "Administrador de Proyecto" && id )
                where = { id };

            let result = await Project.findAll( {
                include: [
                    { model: User, as: "users", where }
                ]
            }, { raw: true } );

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

    async getAllItemOptions( ) {
        try {
            let result = await Item.findAll( { }, { raw: true } );

            let items = result.map( r => r.toJSON( ) );

            const itemOptions = items.map( p => ( {
                id: p.id,
                label: p.title
            } ) );

            return itemOptions;
        } catch ( e ) {
            console.error( e );
        }
    }

    async getAllMeasureUnitOptions( ) {
        //  TODO get measure units by material
        
        try {
            let result = await MeasureUnit.findAll( { }, { raw: true } );

            let items = result.map( r => r.dataValues );

            console.debug( { items } );

            const measureOptions = items.map( m => ( {
                id: m.id,
                label: m.title
            } ) );

            return measureOptions;
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
