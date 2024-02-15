const Product = require('../models/product')
const Cart = require('../models/cart')


exports.getIndex = (req, res, next) => {
    Product.findAll()
        .then((rows) => {
            res.render("shop/product-list", {prods: rows, pageTitle: 'Shop', path: '/'})
        })
        .catch(err => {
        })
}

exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then((rows) => {
            res.render("shop/product-list", {prods: rows, pageTitle: 'Shop', path: '/products'})
        })
        .catch(err => {
        })
}

exports.getProductDetails = (req, res, next) => {
    const productId = req.params.productId;
    Product.findByPk(productId)
        .then((product) => {
            console.log(product)
            res.render("shop/product-detail", {product: product, pageTitle: 'Product Details', path: '/products'})
        })
        .catch(err => {
            console.log(err)
        })
}

exports.getOrders = (req, res, next) => {
    res.render("shop/orders", {product: {}, pageTitle: 'Orders', path: '/orders'})
}

exports.getCheckout = (req, res, next) => {
    res.render("shop/checkout", {pageTitle: 'Checkout', path: '/checkout'})
}

exports.getCart = (req, res, next) => {
    req.user
        .getCart()
        .then(cart => {
            return cart.getProducts()
                .then(products => {
                    res.render("shop/cart", {pageTitle: 'Cart', path: '/cart', products: products})
                    console.log("products are : ",products[0])
                })
                .catch(err => console.log(err))

        })
        .catch(err => console.log(err))
}

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    let fetchedCart;
    let newQty = 1
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart
            cart.getProducts({where: {id: productId}})
                .then(products => {
                    let product;
                    if (products.length > 0)
                        product = products[0]
                    if (product) {
                        const oldQty = product.cartItem.qty
                        newQty = oldQty +1
                        return product
                    }
                    return Product.findByPk(productId)
                })
                .then(product =>{
                    return fetchedCart.addProduct(product,
                        {through: {qty: newQty}})
                })
                .catch(err => console.log(err))
                .then(() => {
                    return res.redirect('/cart')
                })
        }).catch(err => console.log(err))
}

exports.postDeleteCartProduct = (req, res, next) => {
    const prodId = req.body.productId
    req.user.getCart()
        .then(cart =>{
            return cart.getProducts( {where: {id : prodId } })
        })
        .then(product =>{
            return product[0].cartItem.destroy()
        })
        .then(() =>{
            res.redirect("/cart")
        })
        .catch(err => console.log(err))

}

