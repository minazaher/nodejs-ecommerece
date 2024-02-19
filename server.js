const express = require('express');
const bodyParser = require('body-parser');
const path = require("path")
const mongoose = require('mongoose')
const session = require('express-session')
const sessionStore = require('connect-mongodb-session')(session)
const CSRF = require('csurf')

const databaseUrl = require('./util/database').databaseUrl

const store= new sessionStore({
    uri: databaseUrl,
    collection : 'sessions'
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
app.use(session({secret:'secret_code', resave:false, saveUninitialized:false, store: store}))
app.use(csrfProtection)

app.use((req, res, next) => {
    if (!req.session.user) return next()
    User.findById(req.session.user._id)
        .then(user =>{
            req.user = user
            next()
        }).catch(err => console.log(err))
    }
)

app.use((req, res, next) =>{
    res.locals.isAuthenticated = req.session.isLoggedIn
    res.locals.csrfToken = req.csrfToken()
    next()
})

app.use('/admin/', adminRoutes)
app.use(authRoutes)
app.use(shopRoutes)


app.use(errorController.get404)

mongoose.connect(databaseUrl).then(() => {
    app.listen(3000)
}).catch(err => {
    console.log(err)
})



