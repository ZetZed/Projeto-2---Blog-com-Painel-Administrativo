const Sequelize = require("sequelize");

const connection = new Sequelize('guiapress', 'root', 'admin', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;