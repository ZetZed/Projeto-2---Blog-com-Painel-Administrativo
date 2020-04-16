const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs"); //Para criptografar 'password' em hash e salvar no BD


//ROTA 1
router.get("/admin/users", (req, res) => {
    //Busca todos os dados da tabela 'users' no BD 'guiapress' e passa para lista 'users'
    User.findAll({}).then(users => { // Então envia dados para lista 'users'
        //Então renderiza Front-End 'index.ejs'(em views/admin/users), passando a lista 'users' para a lista 'users' no Front-End.
        res.render("admin/users/index", { users: users });
    });
});


//ROTA 2 - Renderiza view. create.ejs
router.get("/admin/users/create", (req, res) => {
    res.render("admin/users/create");
});


//ROTA 3 - BOTÃO CRIAR - Da view 'create.ejs(encaminha para rota /users/create)
router.post("/users/create", (req, res) => { //Cria rota POST
    //Cria variáveis para Receber formulários da view create.ejs
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;

    //PARA EVITAR CADASTRO DE E-MAILS IGUAIS..Verifica se email que usuario coloca já existe no BD ou não..
    User.findOne({ where: { email: email } }).then(user => { //Procura na table 'users', espeficicamente na coluna 'email' tem valor igual ao do formulario email(digitado pelo usuario na view create.ejs) ... E envia para lista 'user'
        if (user == undefined) { // Se user for indefinido,ou seja, se não achar email no BD igual ao email digitado pelo usuario no front-end....email está livre para ser cadastrado no BD.

            //PARA CRIPTOGRAR EM HASH O 'PASSWORD' - Cria variaveis para criptografar variavel 'password' em hash, para enviar pro BD o 'password' criptografado..
            var salt = bcrypt.genSaltSync(10); //Cria variável para receber bcrypt(gerar salt ) e aumentar segurança de 'password'..(10)= pode ser qualquer número
            var hash = bcrypt.hashSync(password, salt); // Cria variável para receber bcrypt(gerar hash) e aumentar a segurança de 'password'..

            //Passa das variaveis Para salvar no BD, no table 'users'
            User.create({
                name: name,
                email: email,
                password: hash //A coluna password da table'users' ira receber a variavel 'hash'

                //Então redireciona para Rota /admin/users/create
            }).then(() => {
                res.redirect("/admin/users");

                //Se der algum erro na comunicação com BD..
            }).catch((error) => {
                res.redirect("/");
            });

        } else { //Se já existir email cadastrado no BD igual ao digitado pelo usuario no front-end create.ejs
            res.redirect("/admin/users/create");
        }
    });
});

//ROTA 4 - PÁGINA DE LOGIN - 
router.get("/login", (req, res) => {
    res.render("admin/users/login")
});

//ROTA 5 - BOTÃO LOGIN - Autentica o login...
router.post("/authenticate", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({ where: { email: email } }).then(user => {
        if (user != undefined) { //Se existe usuário com este email...
            //Valida senha..
            var correct = bcrypt.compareSync(password, user.password); //COMPARA senha que usuario colocou no formulario com senha salva no BD...

            if (correct) { //Se senha estiver correta
                req.session.user = { //Cria sessão chamada 'user'
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
                res.redirect("/admin/articles");

            } else { //Se senha não estiver correta..
                res.redirect("/login");
            }
        } else { //Se não existe usuário com essa senha..
            res.redirect("/login");
        }
    })
});

//ROTA 6 - PÁGINA DE LOGOUT
router.get("/logout")

//EXPORTAÇÃO DE ROTAS
module.exports = router;