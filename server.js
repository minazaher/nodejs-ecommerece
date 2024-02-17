const express = require('express');
const bodyParser = require('body-parser');
const path = require("path")


const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const errorController = require("./controllers/errorController")
const mongoConnect = require('./util/database').mongoConnect

const mongodb = require('mongodb')
const ObjectId = mongodb.ObjectId;


// const Product = require('./models/product')
const User = require('./models/user')
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
    User.findById("65cef7eae80553ae66095fcf")
        .then(user =>{
            req.user = new User(user._id, user.name, user.email, user.cart)
            next()
        }).catch(err => console.log(err))
}

)
app.use('/admin/',adminRoutes)
app.use(shopRoutes)


app.use(errorController.get404)

mongoConnect(() =>{
    app.listen(3000)
})

