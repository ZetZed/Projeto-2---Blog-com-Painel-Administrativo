const Sequelize = require("sequelize");

const connection = new Sequelize('guiapress', 'root', 'admin', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: "-03:00" //Para colocar o horario do Brasil, se não tiver esta opção ira colocar no horário UTC mundial...
});

module.exports = connection;