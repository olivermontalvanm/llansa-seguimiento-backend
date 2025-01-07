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
const sequelize = require("./sequelize");

class RequestService {
    constructor( ) {

    }

    async getRequests( page, itemsPerPage, userId, userRole ) {
        try {
            const query = {
                offset: ( page - 1 ) * itemsPerPage,
                limit: itemsPerPage,
                where: {}
            };

            let userProjects = ( await sequelize.query( `SELECT projectId FROM UsersProjects WHERE userId = ${ userId }`, { raw: true } ) )[ 0 ];

            userProjects = userProjects.map( up => up.projectId );

            const activityInclude = [ "Administrador de Proyecto" ].includes( userRole ) ? 
            { model: Activity, include: [ { model: Project, as: "projectActivities", where: { id: { [Op.in]: userProjects } }, required: true } ], required: true } :
            { model: Activity, include: [ { model: Project, as: "projectActivities" } ], required: true };

            if( [ "Jefe de Compras" ].includes( userRole ) )
                query.where = { ...query.where, costStatus: "REVISADO" };

            if( [ "Analista de Compras" ].includes( userRole ) )
                query.where = { ...query.where, assignee: userId, costStatus: "REVISADO" };

            let result = await Request.findAll( { 
                ...query,
                include: [
                    { model: Item },
                    activityInclude,
                    { model: MeasureUnit },
                    { model: User, as: "createdByUser" },
                    { model: User, as: "assigneeUser" }
                ],
                order: [ [ "createdAt", "DESC" ] ],
            } );

            const count = await Request.count({ distinct: true });

            let requests = result.map( r => r.toJSON( ) ).map( r => ({
                ...r,
                item: r.Item,
                activity: {
                    ...r.Activity,
                    projectActivities: undefined
                },
                project: r.Activity?.projectActivities,
                measureUnit: r.MeasureUnit,
                createdBy: r.createdByUser,
                assignee: r.assigneeUser,
                Item: undefined,
                Activity: undefined,
                MeasureUnit: undefined,
                createdByUser: undefined,
                assigneeUser: undefined
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

    async patchCostStatus( id, status ) {
        try {
            let requestResult = null;

            requestResult = ( await Request.findOne( {
                where: { id }
            } ) );

            if( !requestResult )
                return null;

            requestResult.costStatus = status;

            requestResult = (await requestResult.save( ))?.toJSON( );

            return requestResult;
        } catch ( e ) {
            console.error( e );
            return null;
        }
    }

    async patchShoppingStatus( requestId, status ) {
        try {
            let requestResult = null;

            requestResult = ( await Request.findOne( {
                where: { id: requestId }
            } ) );

            if( !requestResult )
                return null;

            requestResult.shoppingStatus = status;

            requestResult = (await requestResult.save( ))?.toJSON( );

            return requestResult;
        } catch ( e ) {
            console.error( e );
            return null;
        }
    }

    async patchShoppingAssignee( requestId, userId ) {
        try {
            let requestResult = null;
            let userResult = null;

            requestResult = ( await Request.findOne( { where: { id: requestId } } ) );

            if( !requestResult )
                return null;

            if( !isNaN( userId ) && userId !== null ) {
                userResult = ( await User.findOne( { where: { id: userId } }, { raw: true } ) )?.toJSON( );

                if( !userResult )
                    return null;
    
                requestResult.assignee = userResult.id;    
            } else {
                requestResult.assignee = null;
            }

            requestResult = (await requestResult.save( ))?.toJSON( );

            requestResult.assignee = userResult;

            return requestResult;
        } catch ( e ) {
            console.error( e );
            return null;
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
            }, { raw: true } ) )?.toJSON( );

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
