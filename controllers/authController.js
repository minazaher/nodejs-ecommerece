const User = require("../models/user");
const bcrypt = require('bcryptjs')


exports.getLogin = (req, res, next) => {
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

exports.getSignup = (req, res, next) => {
    console.log(req.session)
    res.render("auth/signup", {pageTitle: 'Signup', path: '/signup', isAuthenticated: false})
}
exports.postSignup = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    const confirmPassword = req.body.confirmPassword
    User.findOne({email: email})
        .then((user) =>{
            if (user) {
                return res.redirect('/signup')
            }
            return bcrypt.hash(password,12)
        })
        .then(hashedPassword => {
            const newUser = new User({
                email: email,
                password: hashedPassword,
                cart: { items: [] }
            })
            return newUser.save()
        })
        .then(result=>{
            res.redirect('/login')
    })
        .catch(err =>{
            console.log(err)
        })
}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) =>{
        console.log(err)
        res.redirect('/')
    })
}