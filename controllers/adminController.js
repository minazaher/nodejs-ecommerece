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
    const title = req.body.title;
    const imgUrl = req.body.imgUrl;
    const description = req.body.description;
    const price = req.body.price;
    const product = new Product(title,imgUrl,description, price)
    product.save()
    res.redirect('/')
}

exports.getAdminProducts = (req, res, next) => {
    Product.getAll((allProducts) =>{
        res.render("admin/product-list", {prods: allProducts,pageTitle: 'Admin Products', path: '/admin/products'})
    });
}

exports.getEditProduct = (req,res,next) => {
    res.render("admin/edit-product", {pageTitle: 'Edit Details', path: '/edit-product'})
}