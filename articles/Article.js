const Sequelize = require("sequelize");
const connection = require("../database/database");
const Category = require("../categories/Category");

const Article = connection.define('articles', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

Category.hasMany(Article); // 1 Categoria tem muitos Artigos...Relacionamento 1 para Muitos...
Article.belongsTo(Category); // 1 Artigo pertence a 1 Categoria...Relacionamento 1 para 1...


//Article.sync({ force: true });

module.exports = Article;