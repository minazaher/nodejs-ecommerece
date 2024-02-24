const path = require('path')
const fs = require('fs')

const Product = require('../models/product')
const Order = require('../models/order')


exports.getIndex = (req, res, next) => {
    Product.find()
        .then((rows) => {
            res.render("shop/product-list", {
                prods: rows,
                pageTitle: 'Shop',
                path: '/'
            })
        })
        .catch((err) => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
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
        .catch((err) => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
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
        .catch((err) => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}

exports.postOrder = (req, res, next) => {
    req.user.populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items.map(p => {
                return {qty: p.qty, product: {...p.productId._doc}}
            })
            const order = new Order({
                user: {
                    email: req.user.email,
                    userId: req.user
                },
                products: products
            })
            console.log(order)
            return order.save()
        })
        .then(() => {
            req.user.cart = {items: []}
            req.user.save()
            res.redirect('/orders')
        })
        .catch((err) => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })

}

exports.getOrders = (req, res, next) => {
    Order.find({"user.userId": req.user._id})
        .then(orders => {
            res.render("shop/orders", {
                orders: orders,
                pageTitle: 'Orders',
                path: '/orders'
            })
        })
        .catch((err) => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}
/*
exports.getCheckout = (req, res, next) => {
    res.render("shop/checkout", {pageTitle: 'Checkout', path: '/checkout'})
}
*/
exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items
            res.render("shop/cart", {
                pageTitle: 'Cart', path: '/cart', products: products
            })
        })
        .catch((err) => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })

}

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId)
        .then((product) => {
            return req.user.addToCart(product)
        }).then(result => {
        res.redirect('/cart')
    }).catch((err) => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
    })
}


exports.postDeleteCartProduct = (req, res, next) => {
    const prodId = req.body.productId
    req.user.deleteFromCart(prodId)
        .then(() => {
            res.redirect('/cart')
        })
        .catch((err) => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })


}

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId
    Order.findById(orderId).then(order => {
        if (order.user.userId.toString() !== req.session.user._id.toString()) {
            console.log("false")
            return next(new Error('Unauthorized Request'))
        }
        const invoiceName = 'invoice.pdf'
        const invoicePath = path.join('data', 'invoices', invoiceName)
        const file = fs.createReadStream(invoicePath)
        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
        file.pipe(res)
    }).catch(err => {
        console.log("Error found ", err)
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
    })

}


/*

        fs.readFile(invoicePath, (err, file) =>{
            if (err) {
                console.log("error" + err)
                return next(err)
            }
            res.setHeader('Content-Type', 'application/pdf')
            res.setHeader('Content-Disposition', 'attachment; filename="' + invoiceName + '"');
            res.send(file)
        })
 */
