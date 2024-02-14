const express = require('express');
const bodyParser = require('body-parser');
const path = require("path")


const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const errorController = require("./controllers/errorController")
const db = require('./util/database')

const app = express()

app.set("view engine", "ejs")
app.set("views","views")

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin/',adminRoutes)
app.use(shopRoutes)

app.use(errorController.get404)

db.sync().then(result => {
    console.log("Connected Successfully")
    app.listen(3000)
}).catch(err =>{
    console.log(err)
})

