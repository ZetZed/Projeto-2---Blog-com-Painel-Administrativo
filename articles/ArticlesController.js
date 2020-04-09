const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const Slugify = require("slugify");

//ROTAS

//ROTA 1 - Cria Rota que Renderiza Front-End 'index.ejs'(em views/admin/articles) passando todos os dados da tabela 'articles' atraves da lista 'articles'..
router.get("/admin/articles", (req, res) => {
    //Busca todos os dados da tabela 'articles' no BD 'guiapress'(incluindo os dados do tipo Category) e passa para lista 'articles'
    Article.findAll({
        include: [{ model: Category }] // Na busca de Articles, inclua os dados do tipo Category..
    }).then(articles => { // Então envia dados para lista 'articles'
        //Então renderiza Front-End 'index.ejs'(em views/admin/articles), passando a lista 'articles' para a lista 'articles' no Front-End.
        res.render("admin/articles/index", { articles: articles });
    });
});

//ROTA 2
router.get("/admin/articles/new", (req, res) => {
    Category.findAll().then(categories => { //Para definir qual categoria o post faz parte.... 
        res.render("admin/articles/new", { categories: categories })
    })
});

//ROTA 3 - Recebe dados dos formulários do Front-End 'new.ejs'(em /view/admin/articles) e salva no BD guiapress( na tabela 'articles')
router.post("/articles/save", (req, res) => { //Cria Rota
    //Chama formulários do Front-End 'new.ejs'(em /view/admin/articles) para variaveis
    var title = req.body.title; // Recebe na variavel title o formulario title do Front-end 'new.ejs'
    var body = req.body.body;
    var category = req.body.category;

    //Passa das variaveis Para salvar no BD, no table 'articles'
    Article.create({
        title: title, //title do BD recebe title da variavel...
        slug: Slugify(title), //slug do BD recebe title da variavel mas convertida em slugify..
        body: body,
        categoryId: category //categoryId = Campo gerado na tabela quando cria relacionamento entre tabelas(articles e categories).. Chamado de chave estrangeira(foreigner key)... Faz referencia ao elemento que está em outra tabela

        //Então redireciona para Rota /admin/articles
    }).then(() => {
        res.redirect("/admin/articles");
    });
});

//ROTA 4 - BOTÃO DELETAR - Recebe o formulario 'id' do Front-End 'index.ejs' através da variavel 'id', verifica se id está definida, verifica se id é numerico. Passando nesses requisitos, apaga a id da tabela 'articles'(Criada no arquivo 'Articles.js') que seja igual a id (recebido do formulario id através da variavel id) , depois encaminha para a url 'admin/articles'. 
router.post("/articles/delete", (req, res) => {
    var id = req.body.id; // Cria uma variável 'id' que pega o 'id' do 'index.ejs'
    if (id != undefined) {
        if (!isNaN(id)) { // Verifica se 'id' não é número...
            Article.destroy({ // Apaga dentro de Category
                where: {
                    id: id //A variavel id que for igual ao id do BD
                }
            }).then(() => {
                res.redirect("/admin/articles")
            });
        } else { // Se 'id' não for numérico....
            res.redirect("/admin/articles");
        }
    } else { //Se 'id' for nulo...
        res.redirect("/admin/articles");
    }
});


//Exporta Rotas
module.exports = router;