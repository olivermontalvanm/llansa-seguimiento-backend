"use strict";

//const sql = require( "./sqlserver" );
const lodash = require( "lodash" );
const jwt = require( "jsonwebtoken" );
const config = require( "./config" );
const User = require( "./models/user" );
const Project = require( "./models/project" );
const Activity = require("./models/activity");
const Request = require("./models/request");
const Item = require("./models/item");
const { Op } = require("sequelize");
const MeasureUnit = require("./models/measureUnit");

class RequestService {
    constructor( ) {

    }

    async getRequests( page, itemsPerPage, userRole ) {
        try {
            const query = {
                offset: ( page - 1 ) * itemsPerPage,
                limit: itemsPerPage,
                where: {}
            };

            let result = await Request.findAll( { 
                ...query,
                include: [
                    { model: Item },
                    { model: Activity, include: [ { model: Project, as: "projectActivities" } ] },
                    { model: MeasureUnit },
                    { model: User, as: "createdByUser" }
                ],
                order: [ [ "createdAt", "DESC" ] ]
            } );

            const count = await Request.count({ distinct: true });

            let requests = result.map( r => r.toJSON( ) ).map( r => ({
                ...r,
                item: r.Item,
                activity: {
                    ...r.Activity,
                    projectActivities: undefined
                },
                project: r.Activity.projectActivities,
                measureUnit: r.MeasureUnit,
                createdBy: r.createdByUser,
                Item: undefined,
                Activity: undefined,
                MeasureUnit: undefined,
                createdByUser: undefined
            }));

            return { 
                data: requests, 
                total: count, 
                pages: Math.ceil( count / itemsPerPage )
            };
        } catch ( e ) {
            console.error( e );
        }
    }

    async createRequest( { project, activity, item, quantity, measureUnit }, userId ) {        
        try {
            let projectResult = null;
            let activityResult = null;
            let measureResult = null;
            let itemResult = null;
            let requestResult = null;
            
            projectResult = ( await Project.findOne( {
                where: { id: project.id, title: project.title }
            }, { raw: true } ) ).toJSON( );

            if( !projectResult ) {
                console.error( "Could not find provided project" );
                return null;
            }

            activityResult = ( await Activity.findOne( {
                where: { title: activity, project: projectResult.id }
            }, { raw: true } ) )?.toJSON( );

            //  Create activity if not already exists
            if( !activityResult ) {
                const newActivity = ( await Activity.create( { title: activity, project: projectResult.id }, { raw: true } ) ).toJSON( );

                if( !newActivity ) {
                    console.error( "Could not create activity" );
                    return null;
                }

                activityResult = newActivity;
            }

            measureResult = ( await MeasureUnit.findOne( {
                where: { title: measureUnit }
            }, { raw: true } ) )?.toJSON( );

            //  Create measure if not already exists
            if( !measureResult ) {
                const newMeasure = ( await MeasureUnit.create( { title: measureUnit }, { raw: true } ) ).toJSON( );

                if( !newMeasure ) {
                    console.error( "Could not create measure unit" );
                    return null;
                }

                measureResult = newMeasure;
            }

            itemResult = ( await Item.findOne( {
                where: { title: item }
            }, { raw: true } ) )?.toJSON( );

            //  Create measure if not already exists
            if( !itemResult ) {
                const newItem = ( await Item.create( { title: item }, { raw: true } ) ).toJSON( );

                if( !newItem ) {
                    console.error( "Could not create item" );
                    return null;
                }

                itemResult = newItem;
            }

            requestResult = ( await Request.create( { 
                quantity, createdBy: userId,
                activityId: activityResult.id,
                itemId: itemResult.id,
                measureId: measureResult.id
            } ) ).toJSON( );

            if( !requestResult ) {
                //  TODO Implement transactions to rollback if anything fails
                /**
                 * Delete all request created dependencies
                 */
                console.error( "Could not create request" );
                return null;
            }

            return requestResult;
        } catch ( e ) {
            console.error( e );
        }
    }
}

const requestService = new RequestService( );

module.exports = requestService;
