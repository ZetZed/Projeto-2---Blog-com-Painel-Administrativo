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
            Article.destroy({ // Apaga dentro de Article
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

//ROTA 5 - BOTÃO EDITAR - Recebe do Front-End 'index.ejs'(dentro de /admin/articles) do botão 'Editar', o parametro 'id' através da variavel 'id'. Verifica se id é numero(se não for, reencaminha para admin/articles).Procura na tabela 'articles' por id especifica, depois envia para o front-end 'edit.js'(renderizando este arquivo) através 'article', que recebe através do 'article'
router.get("/admin/articles/edit/:id", (req, res) => {
    var id = req.params.id; //Cria uma variavel id, que pega o id da Rota.

    if (isNaN(id)) { //Verifica se id não é numero...
        res.redirect("/admin/articles");
    }
    Article.findByPk(id).then(articles => { //Pesquisa categoria pelo id...Acessa tabela 'categories' (criada no arquivo Category.js) e busca 'id'..Para que o id não se misture com STRING na url...
        if (articles != undefined) {

            Category.findAll().then(categories => {
                res.render("admin/articles/edit", { categories: categories, articles: articles }); //categories: categories = Passa os dados da lista 'categories' para front end na lista 'categories'..
            });

        } else {
            res.redirect("/admin/articles");
        }
    }).catch(erro => {
        res.redirect("/admin/articles");
    })
});

//ROTA 6 - BOTÃO ATUALIZAR - Recebe do Front-End 'edit.ejs' o botão "Atualizar"
router.post("/articles/update", (req, res) => {
    var id = req.body.id; // Recebe o formulario id na variavel id.
    var title = req.body.title; // Recebe o formulario title na variavel title.
    var body = req.body.body;
    var category = req.body.category
        //para atualizar no BD, tabela 'categories'
    Article.update({ title: title, body: body, categoryId: category, slug: Slugify(title) }, { // Informa qual dado dentro de Category que deseja atualizar. Atualiza dado title que recebe da variavel title, etc...
        where: {
            id: id // Atualiza title,body,categoryId e slug no Article que tem id igual id do formulario.. 
        }
    }).then(() => {
        res.redirect("/admin/articles");
    }).catch(error => {
        res.redirect("/");
    })
});


//ROTA 7 - PAGINAÇÃO DE ARTIGOS - Escolhe quantidade de artigos numa página...
router.get("/articles/page/:num", (req, res) => {
    var page = req.params.num;
    var offset = 0; //offset é 0 para exibir a partir do 1ª elemento(artigo)...

    if (isNaN(page) || page == 1) { //Se página não for numero ou se pagina for igual a 1..
        offset = 0;
    } else {
        offset = parseInt(page) * 4; //parseInt = converte valor Int para valor Num.... * 4 =  multiplica pela quantidade de elementos em cada página(definida em limit: 4)
    }

    Article.findAndCountAll({
        limit: 4, // Número de elementos que quer mostrar na página...Quantidade de artigos na pagina...
        offset: offset //Define de qual artigo começar...  offset: 10 = começa a partir do 10º artigo 
    }).then(articles => { // Vai pesquisar todos os elementos do BD e vai retornar quantidade de elementos que existe na tabela..

        //Se existe próxima pagina ou não
        var next; //Cria variável next 
        if (offset + 4 >= articles.count) { //Se offset + limit(quantidade de artigos por página) for maior que o total de artigos..
            next = false; //Não existe outra página para ser exibida = chegou na ultima pagina...
        } else {
            next = true; //Existe outra página para ser exibida
        }

        var result = { //var result recebe:
                next: next,
                articles: articles
            }
            //Para mostrar categorias na homenavbar
        Category.findAll().then(categories => {
            res.render("admin/articles/page", { result: result, categories: categories }) //Vai renderizar Front-End (page.ejs)  e envia listas result e categories
        });

    })

});



//Exporta Rotas
module.exports = router;