const sequelize = require('../sequelize');
const User = require('./user');
const Project = require('./project');
const Activity = require('./activity');
const Request = require('./request');
const RequestItem = require('./requestItems');

User.belongsToMany( Project, { through: "UsersProjects", foreignKey: "userId", as: "projects" });
Project.belongsToMany( User, { through: "UsersProjects", foreignKey: "projectId", as: "users" });

Project.hasMany( Activity, { foreignKey: "project", as: "activities" } );

User.hasMany( Request, { foreignKey: "createdBy", as: "requests" } );

Request.hasMany( RequestItem, { foreignKey: "request", as: "items" });
Activity.hasMany( RequestItem, { foreignKey: "activity", as: "requests" });
User.hasMany( RequestItem, { foreignKey: "assignee", as: "tasks" });

// Sync all models
async function syncDatabase() {
    await sequelize.authenticate();
    console.log('Connected to database');
    await sequelize.sync( );
    // Update, no drop: await sequelize.sync( { alter: true } );
    // Force update by dropping: await sequelize.sync( { force: true } );
    console.log('Synced to database successfully');
}

module.exports = { sequelize, User, syncDatabase };
