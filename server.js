const express = require('express');
const bodyParser = require('body-parser');
const path = require("path")


const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const errorController = require("./controllers/errorController")
const mongoConnect = require('./util/database').mongoConnect

// const Product = require('./models/product')
// const User = require('./models/user')
// const Cart = require('./models/cart')
// const cartItem = require('./models/cart-item')
// const Order = require('./models/order')
// const orderItem = require('./models/order-item')

const app = express()

app.set("view engine", "ejs")
app.set("views","views")

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) =>{
    next()
})
app.use('/admin/',adminRoutes)
app.use(shopRoutes)


app.use(errorController.get404)

mongoConnect(() =>{
    app.listen(3000)
})

