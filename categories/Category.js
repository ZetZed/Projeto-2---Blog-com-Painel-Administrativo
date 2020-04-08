const Sequelize = require("sequelize");
const connection = require("../database/database");

const Category = connection.define('categories', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: { //slug = versão do título otimizada para url.. Exemplo: titulo = "Desenvolvimento Web" => slug = "desenvolvimento-web"(remove espaços e deixa em letras minusculas)
        type: Sequelize.STRING,
        allowNull: false
    }
})


//Category.sync({ force: true });

module.exports = Category;