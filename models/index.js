const sequelize = require('../sequelize');
const User = require('./user');
const Project = require('./project');
const Activity = require('./activity');
const Request = require('./request');
const RequestItem = require('./requestItems');
const Item = require('./item');
const Role = require('./role');

//  Users-Projects
User.belongsToMany( Project, { through: "UsersProjects", foreignKey: "userId", as: "projects" });
Project.belongsToMany( User, { through: "UsersProjects", foreignKey: "projectId", as: "users" });

//  Project-Activity
Project.hasMany( Activity, { foreignKey: "project", as: "activities" } );
Activity.belongsTo( Project, { foreignKey: "project", as: "projectActivities" })

User.hasMany( Request, { foreignKey: "createdBy", as: "requests" } );
Request.belongsTo( User, { foreignKey: "createdBy", as: "userRequests" })

//  Request-RequestItems
Request.hasMany(RequestItem, { foreignKey: 'requestId', as: 'requestItems' });
RequestItem.belongsTo(Request, { foreignKey: 'requestId', as: 'request' });

//  RequestItem-Item
RequestItem.belongsTo(Item, { foreignKey: 'itemId', as: 'item' });
Item.hasMany(RequestItem, { foreignKey: 'itemId', as: 'requestItems' });

//  RequestItem-User
RequestItem.belongsTo(User, { foreignKey: 'assignee', as: 'user' });
User.hasMany(RequestItem, { foreignKey: 'assignee', as: 'requestUsers' });

//  RequestItem-Activity
RequestItem.belongsTo(Activity, { foreignKey: 'activityId', as: 'activity' });
Activity.hasMany(RequestItem, { foreignKey: 'activityId', as: 'requestActivities' });

//  User-Role
Role.hasOne( User, { foreignKey: "roleId", as: "role" } );
User.belongsTo( Role, { foreignKey: "roleId", as: "userRole" })

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
