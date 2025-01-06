const sequelize = require('../sequelize');
const User = require('./user');
const Project = require('./project');
const Activity = require('./activity');
const Request = require('./request');
const Item = require('./item');
const Role = require('./role');
const Note = require('./note');
const MeasureUnit = require('./measureUnit');

//  Users-Projects
User.belongsToMany( Project, { through: "UsersProjects", foreignKey: "userId", as: "projects" });
Project.belongsToMany( User, { through: "UsersProjects", foreignKey: "projectId", as: "users" });

//  Project-Activity
Project.hasMany( Activity, { foreignKey: "project", as: "activities" } );
Activity.belongsTo( Project, { foreignKey: "project", as: "projectActivities" })

User.hasMany( Request, { foreignKey: "createdBy", as: "requests" } );
Request.belongsTo( User, { foreignKey: "createdBy", as: "createdByUser" })

//  User-Role
Role.hasOne( User, { foreignKey: "roleId", as: "role" } );
User.belongsTo( Role, { foreignKey: "roleId", as: "userRole" })

//  Requests
Request.belongsTo( Activity, { foreignKey: "activityId" });
Activity.hasMany( Request, { foreignKey: "activityId" } );

Request.belongsTo( User, { foreignKey: "assignee", as: "assigneeUser" } );
User.hasMany( Request, { foreignKey: "assignee" } );

Item.hasMany( Request, { foreignKey: "itemId" } );
Request.belongsTo( Item, { foreignKey: "itemId" } );

Request.hasMany( Note, { foreignKey: "requestId" } );
Note.belongsTo( Request, { foreignKey: "requestId" } );

User.hasOne( Note, { foreignKey: "userId" } );
Note.belongsTo( User, { foreignKey: "userId" } );

MeasureUnit.hasMany( Request, { foreignKey: "measureId" } );
Request.belongsTo( MeasureUnit, { foreignKey: "measureId" })

// Sync all models
async function syncDatabase() {
    await sequelize.authenticate();
    console.log('Connected to database');
    await sequelize.sync();
    // Update, no drop: await sequelize.sync( { alter: true } );
    // Force update by dropping: await sequelize.sync( { force: true } );
    console.log('Synced to database successfully');
}

module.exports = { sequelize, User, syncDatabase };
