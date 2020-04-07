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
    res.render("index"); //Para mandar msg que está em HTML no arquivo 'Index.ejs' na pasta views, através do view engine ejs para a tela principal..
});

//RODAR APLICAÇÃO
app.listen(8080, () => {
    console.log("O servidor está rodando!")
})