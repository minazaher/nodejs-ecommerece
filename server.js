const express = require('express');
const bodyParser = require('body-parser');
const path = require("path")
const mongoose = require('mongoose')
const session = require('express-session')
const sessionStore = require('connect-mongodb-session')(session)
const CSRF = require('csurf')
const flash = require('connect-flash')

const databaseUrl = require('./util/database').databaseUrl

const store = new sessionStore({
    uri: databaseUrl,
    collection: 'sessions'
})
const csrfProtection = CSRF();

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')

const errorController = require("./controllers/errorController")


const User = require('./models/user')

const app = express()

app.set("view engine", "ejs")
app.set("views", "views")

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({secret: 'secret_code', resave: false, saveUninitialized: false, store: store}))
app.use(csrfProtection)
app.use(flash())

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn
    res.locals.csrfToken = req.csrfToken()
    next()
})

app.use((req, res, next) => {
        throw new Error('dummy')
        if (!req.session.user) return next()
        User.findById(req.session.user._id)
            .then(user => {
                req.user = user
                next()
            }).catch(err => {
            next(new Error(err))
        })
    }
)


app.use('/admin/', adminRoutes)
app.use(authRoutes)
app.use(shopRoutes)

app.get('/500', errorController.get500)

app.use(errorController.get404)

app.use((err, req, res, next) => {
    res.status(500).render('500', {path:'' ,pageTitle: 'Error!',isAuthenticated: req.session.isLoggedIn})
})

mongoose.connect(databaseUrl).then(() => {
    app.listen(3000)
}).catch(err => {
    console.log(err)
})



