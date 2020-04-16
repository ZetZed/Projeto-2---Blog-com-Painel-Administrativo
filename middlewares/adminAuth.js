//= Middleware =  Verifica sessão para ter acesso a rota .
function adminAuth(req, res, next) { //Next serve para dar continuidade na requisição..
    if (req.session.user != undefined) { //Se sessão user existe...Se usuario estiver logado..
        next();
    } else { //Se sessão não existe...
        res.redirect("/login");
    }
}

module.exports = adminAuth