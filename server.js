const express = require('express');
const bodyParser = require('body-parser');
const path = require("path")


const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const errorController = require("./controllers/errorController")
const databaseUrl = require('./util/database').databaseUrl

const mongoose = require('mongoose')

const User = require('./models/user')

const app = express()

app.set("view engine", "ejs")
app.set("views", "views")

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
    User.findById("65d101a5e0fabe3177c2afd7")
        .then(user =>{
            req.user = user
            next()
        }).catch(err => console.log(err))

    }
)
app.use('/admin/', adminRoutes)
app.use(shopRoutes)


app.use(errorController.get404)

mongoose.connect(databaseUrl).then(() => {

    app.listen(3000)

}).catch(err => {
    console.log(err)
})



