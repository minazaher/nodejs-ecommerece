const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
    res.render(
        'admin/add-product',
        {
            pageTitle: 'Add Product',
            path: '/admin/add-product'
        })
}

exports.postAddProduct = (req, res, next) => {
    const product = new Product(req.body.title)
    product.save()
    res.redirect('/')
}

exports.getProducts = (req, res, next) => {
    Product.getAll((allProducts) =>{
        res.render("shop/product-list", {prods: allProducts,pageTitle: 'Shop', path: '/'})
    });
}

exports.getProductDetails =  (req,res,next) =>{
    res.render("shop/product-details", {product:{}, pageTitle: 'Product Details', path: '/product-details'})
}

exports.getEditProduct = (req,res,next) => {
    res.render("admin/edit-product", {pageTitle: 'Edit Details', path: '/edit-product'})
}

exports.getCheckout = (req,res,next) => {
    res.render("shop/checkout", {pageTitle: 'Checkout', path: '/checkout'})
}

exports.getCart = (req,res,next) => {
    res.render("shop/cart", {pageTitle: 'Cart', path: '/cart'})
}