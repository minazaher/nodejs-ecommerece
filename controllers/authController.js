const User = require("../models/user");

const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const {validationResult} = require('express-validator')


const nodeMailer = require('nodemailer')

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: 'menazaher115@gmail.com',
        pass: 'jvmf rblg vgkd ldfa'
    },
});

exports.getLogin = (req, res, next) => {
    let errorMessage = req.flash('error')
    errorMessage = errorMessage.length > 0 ? errorMessage[0] : null
    res.render("auth/login", {
        pageTitle: 'Login',
        path: '/login',
        error: errorMessage,
        oldInput: {
            email: "",
            password: ""
        },
        validationErrors: []
    })
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).render("auth/login",
            {
                pageTitle: 'Login',
                path: '/login',
                error: errors.array()[0].msg,
                oldInput: {
                    email: email,
                    password: password
                },
                validationErrors: errors.array()
            })
    }

    User.findOne({email: email})
        .then(user => {
            if (!user) {
                return res.status(422).render("auth/login",
                    {
                        pageTitle: 'Login',
                        path: '/login',
                        error: "Invalid Email",
                        oldInput: {
                            email: email,
                            password: password
                        },
                        validationErrors: []
                    })
            }
            bcrypt.compare(password, user.password).then(passwordMatch => {
                if (passwordMatch) {
                    req.session.isLoggedIn = true
                    req.session.user = user
                    return req.session.save((err) => {
                        console.log(err);
                        res.redirect('/')
                    })
                }
                return res.status(422).render("auth/login",
                    {
                        pageTitle: 'Login',
                        path: '/login',
                        error: 'Invalid email or password.',
                        oldInput: {
                            email: email,
                            password: password
                        },
                        validationErrors: []
                    })
            }).catch(err => {
                console.log(err)
                res.redirect('/login')
            })

        })
        .catch((err) => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}

exports.getSignup = (req, res, next) => {
    let errorMessage = req.flash('error')
    errorMessage = errorMessage.length > 0 ? errorMessage[0] : null
    res.render("auth/signup",
        {
            pageTitle: 'Signup',
            path: '/signup',
            error: errorMessage,
            oldInput: {email: "", password: "", confirmPassword: ""},
            validationErrors: []
        })
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors.array())
        return res.status(422).render("auth/signup",
            {
                pageTitle: 'Signup',
                path: '/signup',
                error: errors.array()[0].msg,
                oldInput: {email: email, password: password, confirmPassword: req.body.confirmPassword},
                validationErrors: errors.array()
            })
    }
    bcrypt.hash(password, 12).then(hashedPassword => {
        const newUser = new User({
            email: email,
            password: hashedPassword,
            cart: {items: []}
        })
        return newUser.save()
    }).then(() => {
        res.redirect('/login')
        return transporter.sendMail({
            to: email,
            from: 'menazaher115@gmail.com',
            subject: "Successful Signup",
            html: 'You Have Signed Up Successfully'
        })
    }).catch((err) => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
    })

}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err)
        res.redirect('/')
    })
}

exports.getReset = (req, res, next) => {
    let errorMessage = req.flash('error')
    errorMessage = errorMessage.length > 0 ? errorMessage[0] : null
    res.render("auth/reset", {pageTitle: 'Password Reset', path: '/reset', error: errorMessage})
}

exports.postReset = (req, res, next) => {
    const email = req.body.email

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).render("auth/reset", {
            pageTitle: 'Password Reset',
            path: '/reset',
            error: errors.array()[0].msg
        })
    }

    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err)
            return res.redirect('/reset')
        }
        const token = buffer.toString("hex")
        User.findOne({email: email})
            .then(user => {
                if (!user) {
                    req.flash('error', 'No Account Registered with This Email')
                    return res.redirect('/reset')
                }
                user.resetToken = token
                user.resetTokenExpiryDate = Date.now() + 3600000 // One Hour
                return user.save()
            }).then(result => {
            res.redirect('/')
            return transporter.sendMail({
                to: email,
                from: 'menazaher115@gmail.com',
                subject: "Password Reset",
                html: `
                <p> You Requested a Password Reset For This Email ${email}</p>
                <p>Click this <a href= "http://localhost:3000/reset/${token}">Link</a> to set a new password</p>`
            })
        }).catch((err) => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
    })
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token
    let errorMessage = req.flash('error')
    errorMessage = errorMessage.length > 0 ? errorMessage[0] : null

    User.findOne({
        resetToken: token,
        resetTokenExpiryDate: {$gt: Date.now()} // Checking if Token Still Valid
    })
        .then(user => {
            if (user) {
                res.render("auth/new-password", {
                    pageTitle: 'Set New Password',
                    path: '/new-password',
                    error: errorMessage,
                    userId: user._id.toString(),
                    passwordToken: token
                })
            }
        })
}

exports.postNewPassword = (req, res, next) => {
    const passwordToken = req.body.passwordToken
    const newPassword = req.body.password
    const userId = req.body.userId
    let resetUser;
    User.findOne({
        resetToken: passwordToken,
        resetTokenExpiryDate: {
            $gt: Date.now() // Checking if Token Still Valid
        },
        _id: userId
    }).then(user => {
        resetUser = user;
        return bcrypt.hash(newPassword, 12)
    }).then(hashedPassword => {
        resetUser.password = hashedPassword
        resetUser.resetToken = undefined
        resetUser.resetTokenExpiryDate = undefined
        return resetUser.save()
    })
        .then(result => {
            res.redirect('/login')
        })
        .catch((err) => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}


