const express = require("express");
const router = express.Router();
const Category = require("./Category");
const Slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth");



//ROTAS DE CATEGORIAS

//ROTA 1 - Acessa  Front-End 'new.ejs', que está na pasta categories dentro da pasta admin, em views
router.get("/admin/categories/new", adminAuth, (req, res) => { // Cria rota na url
    res.render("admin/categories/new") //Lê e renderiza arquivo 'new.ejs' que está na pasta 'categories' dentro da pasta 'admin', dentro da pasta 'views'(onde estão os arquivos em HTML - front-end).
        //res.send("ROTA PARA CRIAR UMA NOVA CATEGORIA!") //Imprime isso..
});

//ROTA 2 - BOTÃO CADASTRAR - Recebe o formulario 'title' do Front-End 'new.ejs' através da variavel 'title', e envia para as colunas 'title' e 'slug' da tabela 'categories' (Criada no arquivo 'Category.js'), depois encaminha para a url 'admin/categories'..
router.post("/categories/save", adminAuth, (req, res) => { //PARA TRABALHAR COM FORMULÁRIOS É MELHOR USAR O MÉTODO 'POST' QUE O MÉTODO 'GET'
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

//ROTA 3 - Acessa a tabela 'categories' e pega todas os dados e renderiza (envia/acessa) no Front-End 'index.ejs' (que está na pasta categories dentro da pasta admin, em views) através do 'categoriaA' e no Front-End recebe através do 'categoriaB'. 
router.get("/admin/categories", adminAuth, (req, res) => { //Cria a rota
    Category.findAll().then(categoriaA => { //Acessa a tabela 'categories' (que foi criada pelo arquivo Category) para encontrar tudo na tabela...depois envia para o front-end 'index' através do 'categoriaA'
        res.render("admin/categories/index", { categoriaB: categoriaA }); //Passa as categorias para o Front-end..envia através de 'categoriaA', e no front end recebe através do 'categoriaB'
    });
});

//ROTA 4 - BOTÃO DELETAR - Recebe o formulario 'id' do Front-End 'index.ejs' através da variavel 'id', verifica se id está definida, verifica se id é numerico. Passando nesses requisitos, apaga a id da tabela 'categories'(Criada no arquivo 'Category.js') que seja igual a id (recebido do formulario id através da variavel id) , depois encaminha para a url 'admin/categories'. 
router.post("/categories/delete", adminAuth, (req, res) => {
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

//ROTA 5 - BOTÃO EDITAR - Recebe do Front-End 'index.ejs'(dentro de /admin/categories) do botão 'Editar', o parametro 'id' através da variavel 'id'. Verifica se id é numero(se não for, reencaminha para admin/categories).Procura na tabela 'categories' por id especifica, depois envia para o front-end 'edit.js'(renderizando este arquivo) através 'categoria', que recebe através do 'categoria2'
router.get("/admin/categories/edit/:id", adminAuth, (req, res) => {
    var id = req.params.id; //Cria uma variavel id, que pega o id da Rota.

    if (isNaN(id)) { //Verifica se id não é numero...
        res.redirect("/admin/categories");
    }
    Category.findByPk(id).then(categoria => { //Pesquisa categoria pelo id...Acessa tabela 'categories' (criada no arquivo Category.js) e busca 'id'..Para que o id não se misture com STRING na url...
        if (categoria != undefined) {
            res.render("admin/categories/edit", { categoria2: categoria }); //categoria2: categoria = Passa os dados da lista 'categoria' para front end na lista 'categoria2'..
        } else {
            res.redirect("/admin/categories");
        }
    }).catch(erro => {
        res.redirect("/admin/categories");
    })
});

//ROTA 6 - BOTÃO ATUALIZAR - Recebe do Front-End 'edit.ejs' o botão "Atualizar"
router.post("/categories/update", adminAuth, (req, res) => {
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


//EXPORTA ROTAS...
module.exports = router;