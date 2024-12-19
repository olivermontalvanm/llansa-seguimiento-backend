const { Sequelize } = require( "sequelize" );
const config = require( "./config" );

const sequelize = new Sequelize( config.sqlConfig.database, config.sqlConfig.user, config.sqlConfig.password, {
    host: config.sqlConfig.server,
    dialect: "mssql",
    dialectOptions: {
        options: {
            encrypt: false,
            trustServerCertificate: true
        }
    },
    logging: false
} );

module.exports = sequelize;
