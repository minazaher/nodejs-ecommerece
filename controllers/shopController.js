const Product = require('../models/product')


exports.getIndex = (req, res, next) => {
    Product.getAll((allProducts) =>{
        res.render("shop/index", {prods: allProducts,pageTitle: 'Shop', path: '/'})
    });
}

exports.getProducts = (req, res, next) => {
    Product.getAll((allProducts) =>{
        res.render("shop/product-list", {prods: allProducts,pageTitle: 'Shop', path: '/products'})
    });
}

exports.getProductDetails =  (req,res,next) =>{
    const productId = req.params.productId;
    Product.getProductById(productId, (product) =>{
        res.render("shop/product-detail", {product:product, pageTitle: 'Product Details', path: '/products'})

    })
}

exports.getOrders =  (req,res,next) =>{
    res.render("shop/orders", {product:{}, pageTitle: 'Orders', path: '/orders'})
}

exports.getCheckout = (req,res,next) => {
    res.render("shop/checkout", {pageTitle: 'Checkout', path: '/checkout'})
}

exports.getCart = (req,res,next) => {
    res.render("shop/cart", {pageTitle: 'Cart', path: '/cart'})
}