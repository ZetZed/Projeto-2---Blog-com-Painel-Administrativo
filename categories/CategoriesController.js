const express = require("express");
const router = express.Router();
const Category = require("./Category");
const Slugify = require("slugify");



//ROTAS DE CATEGORIAS
router.get("/admin/categories/new", (req, res) => { // Cria rota na url
    res.render("admin/categories/new") //Lê e renderiza arquivo 'new.ejs' que está na pasta 'categories' dentro da pasta 'admin', dentro da pasta 'views'(onde estão os arquivos em HTML - front-end).
        //res.send("ROTA PARA CRIAR UMA NOVA CATEGORIA!") //Imprime isso..
});

router.post("/categories/save", (req, res) => { //PARA TRABALHAR COM FORMULÁRIOS É MELHOR USAR O MÉTODO 'POST' QUE O MÉTODO 'GET'
    var title = req.body.title; // Cria uma variavel que recebe os dados do formulário 'title' em 'new.ejs'
    if (title != undefined) { // Verifica se title está válido

        Category.create({ // Chama o const 'Category' que acessa o BD, table 'categories'
            title: title, // Envia para 'title'(no arquivo Category.js) o 'title' recebido  do arquivo 'new.ejs'. 
            slug: Slugify(title) // Envia para 'slug'(no arquivo Category.js) o 'title' transformado pelo model 'slugify'.......slug = versão do título otimizada para url..
        }).then(() => {
            res.redirect("/admin/categories");
        })
    } else {
        res.redirect("/admin/categories/new"); //Caso title está indefinido, redireciona para o endereço admin/categories/new...
    }
});

router.get("/admin/categories", (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/categories/index", { categories: categories }); //Passa as categorias para o Front-end..
    });
});

router.post("/categories/delete", (req, res) => {
    var id = req.body.id; // Cria uma variável 'id' que pega o 'id' do 'index.ejs'
    if (id != undefined) {
        if (!isNaN(id)) { // Verifica se 'id' não é número...
            Category.destroy({ // Apaga dentro de Category
                where: {
                    id: id //A variavel id que for igual ao id do BD
                }
            }).then(() => {
                res.redirect("/admin/categories")
            });
        } else { // Se 'id' não for numérico....
            res.redirect("/admin/categories");
        }
    } else { //Se 'id' for nulo...
        res.redirect("/admin/categories");
    }
});

router.get("/admin/categories/edit/:id", (req, res) => {
    var id = req.params.id; //Cria uma variavel id, que pega o id da Rota.

    if (isNaN(id)) {
        res.redirect("/admin/categories");
    }
    Category.findByPk(id).then(categoria => { //Pesquisa Categoria pelo id
        if (categoria != undefined) {
            res.render("admin/categories/edit", { categoria: categoria }); //categoria: categoria = Passa os dados da categoria para front end..
        } else {
            res.redirect("/admin/categories");
        }
    }).catch(erro => {
        res.redirect("/admin/categories");
    })
});

router.post("/categories/update", (req, res) => {
    var id = req.body.id; // Recebe o formulario id na variavel id.
    var title = req.body.title; // Recebe o formulario title na variavel title.
    //para atualizar no BD, tabela 'categories'
    Category.update({ title: title, slug: Slugify(title) }, { // Informa qual dado dentro de Category que deseja atualizar. Atualiza dado title que recebe da variavel title.
        where: {
            id: id // Atualiza title na Category que tem id igual id do formulario.. 
        }

    }).then(() => {
        res.redirect("/admin/categories");
    })

});


module.exports = router;