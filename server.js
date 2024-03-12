const express = require('express');
const bodyParser = require('body-parser');
const path = require("path")
const fs = require('fs')
const mongoose = require('mongoose')
const session = require('express-session')
const sessionStore = require('connect-mongodb-session')(session)
const CSRF = require('csurf')
const flash = require('connect-flash')
const multer = require('multer')
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')

const errorController = require("./controllers/errorController")
const User = require('./models/user')

const databaseUrl = require('./util/database').databaseUrl
const logStream = fs.createWriteStream(path.join(__dirname, "access.log"), {flags : "a"})

const app = express()
app.use(helmet())
app.use(compression())
app.use(morgan('common',  {stream : logStream}))

const store = new sessionStore({
    uri: databaseUrl,
    collection: 'sessions'
})

const csrfProtection = CSRF();
const multerStorage = multer.diskStorage({
    destination: (req,file,cb) => cb(null, 'images'),
    filename: (req,file,cb) => cb(null, file.originalname)
})

const  fileFilter = (req,file,cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png')
        cb(null, true)
    else
        cb(null, false)
}

app.set("view engine", "ejs")
app.set("views", "views")

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')

app.use(bodyParser.urlencoded({extended: false}))

app.use(express.static(path.join(__dirname, 'public')))
app.use('/images',express.static(path.join(__dirname, 'images')))

app.use(multer({storage: multerStorage}).single('image'))
app.use(session({secret:'secret_code', resave:false, saveUninitialized:false, store: store}))

app.use(csrfProtection)
app.use(flash())

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn
    res.locals.csrfToken = req.csrfToken()
    next()
})

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next();
            }
            req.user = user;
            next();
        })
        .catch(err => {
            next(new Error(err));
        });
});


app.use('/admin/', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)

app.get('/500', errorController.get500)

app.use(errorController.get404)

app.use((error, req, res, next) => {
    console.log(error)
    res.status(500).render('500', {
        pageTitle: 'Error!',
        path: '/500',
        isAuthenticated: req.session.isLoggedIn
    });
});
mongoose.connect(databaseUrl).then(() => {
    app.listen(process.env.PORT ||3000)
}).catch(err => {
    console.log(err)
})



