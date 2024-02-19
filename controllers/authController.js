const User = require("../models/user");
exports.getLogin = (req, res, next) => {
    console.log(req.session)
    res.render("auth/login", {pageTitle: 'Login', path: '/login', isAuthenticated: false})
}


exports.postLogin = (req, res, next) => {
    User.findById("65d101a5e0fabe3177c2afd7")
        .then(user =>{
            req.session.isLoggedIn = true
            req.session.user = user
            req.session.save(()=>{
                res.redirect('/')
            })
        }).catch(err => console.log(err))
}


exports.postLogout = (req, res, next) => {
    req.session.destroy((err) =>{
        console.log(err)
        res.redirect('/')
    })
}