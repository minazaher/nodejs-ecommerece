const express = require('express');
const bodyParser = require('body-parser');
const path = require("path")


const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const errorController = require("./controllers/errorController")
const db = require('./util/database')

const Product = require('./models/product')
const User = require('./models/user')
const Cart = require('./models/cart')
const cartItem = require('./models/cart-item')

const app = express()

app.set("view engine", "ejs")
app.set("views","views")

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) =>{
    User.findByPk(1)
        .then(user =>{
            req.user = user
            next()
        })
        .catch(err=>{
            console.log(err)
        })
})
app.use('/admin/',adminRoutes)
app.use(shopRoutes)


app.use(errorController.get404)

Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'})
User.hasMany(Product)

Cart.belongsToMany(Product,{through: cartItem} )
Product.belongsToMany(Cart,{through: cartItem} )

Cart.belongsTo(User)
User.hasOne(Cart)

// db.sync({force :  true})
db.sync()
    .then(result => {
        // User.create({name: 'Mina', email: 'test@test.com'})
    app.listen(3000)
}).catch(err =>{
    console.log(err)
})

