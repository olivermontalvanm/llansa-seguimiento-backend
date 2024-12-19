const sequelize = require('../sequelize');
const User = require('./user');
const Project = require('./project');

User.belongsToMany( Project, { through: "UsersProjects", foreignKey: "userId", as: "projects" });
Project.belongsToMany( User, { through: "UsersProjects", foreignKey: "projectId", as: "users" });

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
