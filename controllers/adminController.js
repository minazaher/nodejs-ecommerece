const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
    res.render(
        'admin/edit-product',
        {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false,
        })
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imgUrl = req.body.imgUrl;
    const description = req.body.description;
    const price = req.body.price;
    const product = new Product(null,title,imgUrl,description, price)
    product
        .save()
        .then(() =>{
            res.redirect('/')
        })
        .catch((err) =>{
            console.log(err)
        })
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imgUrl;
    const updatedDesc = req.body.description;
    const updatedProduct = new Product(
        prodId,
        updatedTitle,
        updatedImageUrl,
        updatedDesc,
        updatedPrice
    );
    updatedProduct.save();
    res.redirect('/admin/products');
};


exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.getProductById(prodId, product => {
        if (!product) {
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            product: product
        });
    });
}; 


exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId
    Product.getProductById(prodId,product =>{
        const productInstance = new Product(product.id, product.title, product.imgUrl, product.description, product.price);
        if (productInstance)
            productInstance.delete()
        else
            console.log("No Product Available")
    })
    res.redirect('/admin/products')

}


exports.getAdminProducts = (req, res, next) => {
    Product.getAll()
        .then(([rows, tableMeta]) => {
            res.render("shop/product-list", {prods: rows, pageTitle: 'Shop', path: '/admin/products'})
        })
        .catch(err => {
            console.log(err)
        })
}

