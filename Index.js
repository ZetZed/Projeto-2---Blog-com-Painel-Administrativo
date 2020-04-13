const express = require("express");
const app = express(); //Cria instância do express
const BodyParser = require("body-parser");
const connection = require("./database/database");

const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");


//VIEW ENGINE
app.set('view engine', 'ejs'); //Seleciona a View Engine 'Ejs' , que serve para ler HTML(na pasta view)

//STATIC
app.use(express.static('public')); //Configuração pro Express aceitar trabalhar com arquivos estáticos (Css, imagem, JS no Front-End), que estarão na pasta 'public'. 

//BODY PARSER
app.use(BodyParser.urlencoded({ extended: false })); //configura BodyParser = Para poder trabalhar com formulários
app.use(BodyParser.json()); //Diz pro Body Parser que além de aceitar dados de formulários, também aceitar dados de formato Json.

//DATABASE
connection
    .authenticate() //Autentica com BD
    .then(() => { //Se autenticação der certo, envia mensagem abaixo.
        console.log("Conexão com BD feita com sucesso!");
    }).catch((error) => { //Se autenticação der erro, manda mensagem de erro.
        console.log(error);
    })



//ROTAS
app.use("/", categoriesController);
app.use("/", articlesController);

app.get("/", (req, res) => {
    //res.send("Bem vindo ao meu site"); //Para mandar msg para tela principal, sem usar o HTML...
    Article.findAll({
        order: [
            ['id', 'DESC']
        ]
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render("index", { articles: articles, categories: categories }); //Para mandar msg que está em HTML no arquivo 'Index.ejs' na pasta views, através do view engine ejs para a tela principal..
        });
    });
});

app.get("/:slug", (req, res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if (article != undefined) {
            Category.findAll().then(categories => {
                res.render("article", { article: article, categories: categories }); //Para mandar msg que está em HTML no arquivo 'Index.ejs' na pasta views, através do view engine ejs para a tela principal..
            });
        } else {
            res.redirect("/");
        }
    }).catch(error => {
        res.redirect("/");
    });
})


//Página de categoria específica..(clica na categoria no navbar e na index aparece só os artigos relacionados)
app.get("/category/:slug", (req, res) => {
    var slug = req.params.slug;
    Category.findOne({ //Pesquisa em Category pelo slug
        where: {
            slug: slug
        },
        include: [{ model: Article }] //Quando fizer a busca na categoria, inclui todos os artigos que estão relacionados 
    }).then(category => {
        if (category != undefined) {
            //Faz busca de todas as categorias( para preencher o menu da navbar)
            Category.findAll().then(categories => {
                res.render("index", { articles: category.articles, categories: categories })
            });

        } else {
            res.redirect("/");
        }
    }).catch(error => { //Caso haja algum erro de comunicação com o BD recebe o erro e redireciona...
        res.redirect("/");
    })
});

//RODAR APLICAÇÃO
app.listen(8080, () => {
    console.log("O servidor está rodando!")
})