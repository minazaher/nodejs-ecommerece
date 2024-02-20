const Product = require('../models/product')
const Order = require('../models/order')


exports.getIndex = (req, res, next) => {
    Product.find()
        .then((rows) => {
            res.render("shop/product-list", {
                prods: rows,
                pageTitle:'Shop',
                path: '/'
            })
        })
        .catch(err => {
            console.log(err)
        })
}

exports.getProducts = (req, res, next) => {
    Product.find()
        .then((rows) => {
            res.render("shop/product-list", {
                    prods: rows,
                pageTitle: 'Shop',
                path: '/products'

            })
        })
        .catch(err => {
            console.log(err)
        })
}


exports.getProductDetails = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId)
        .then((product) => {
            console.log(product)
            res.render("shop/product-detail", {
                product: product,
                pageTitle: 'Product Details',
                path: '/products'
            })
        })
        .catch(err => {
            console.log(err)
        })
}

exports.postOrder = (req, res, next) => {
    req.user.populate('cart.items.productId')
        .then( user => {
            const products = user.cart.items.map( p =>{
                return {qty: p.qty, product:{...p.productId._doc}}
            })
            const order = new Order({
                user:{
                    email: req.user.email,
                    userId: req.user
                },
                products: products
            })
            console.log(order)
            return order.save()
        })
        .then(() =>{
            req.user.cart = {items:[]}
            req.user.save()
            res.redirect('/orders')
        })
        .catch(err => console.log(err))

}

exports.getOrders = (req, res, next) => {
    Order.find({"user.userId": req.user._id})
        .then(orders =>{
            res.render("shop/orders", {orders: orders,
                pageTitle: 'Orders',
                path: '/orders'
            })
        })
        .catch(err => console.log(err))
}
/*
exports.getCheckout = (req, res, next) => {
    res.render("shop/checkout", {pageTitle: 'Checkout', path: '/checkout'})
}
*/
exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .then( user => {
            const products = user.cart.items
        res.render("shop/cart", {pageTitle: 'Cart', path: '/cart', products: products
        })
    } )

}

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId)
        .then((product) =>{
            return req.user.addToCart(product)
        }).then(result =>{
            res.redirect('/cart')
    }).catch(err =>{
        console.log(err)
    })

}


exports.postDeleteCartProduct = (req, res, next) => {
    const prodId = req.body.productId
    req.user.deleteFromCart(prodId)
        .then(() =>{
            res.redirect('/cart')
        })
        .catch(err =>console.log(err))


}

