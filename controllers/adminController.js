const Product = require('../models/product')
const mongodb = require("mongodb");

exports.getAddProduct = (req, res, next) => {
    res.render(
        'admin/edit-product',
        {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false,
            isAuthenticated: req.session.isLoggedIn

        })
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imgUrl = req.body.imgUrl;
    const description = req.body.description;
    const price = req.body.price;
    const product = new Product({
            title: title,
            price: price,
            description: description,
            imgUrl: imgUrl,
            userId: req.user._id
        }
    )
    product.save()
        .then((result) => {
            console.log(result)
            res.redirect('/admin/products')
        })
        .catch((err) => {
            console.log(err)
        })
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    console.log(req.body)
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imgUrl;
    const updatedDesc = req.body.description;

    Product.findById(prodId)
        .then(product => {
            product.title = updatedTitle
            product.price = updatedPrice
            product.imgUrl = updatedImageUrl
            product.description = updatedDesc
            return product.save()
        }).then(() => {
        res.redirect('/admin/products');
    })
        .catch((err) => {
            console.log(err)
        })
};


exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;

    Product.findById(prodId)
        .then(product => {
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product,
                isAuthenticated: req.session.isLoggedIn
            });
        }).catch(() => {
        res.redirect('/')
    })

};


exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId
    Product.findByIdAndDelete(prodId)
        .then(() => {
            res.redirect('/admin/products')
        })
        .catch((err) => {
            console.log(err)
        })

}


exports.getAdminProducts = (req, res, next) => {
    Product.find()
        .then((products) => {
            res.render("admin/product-list", {
                prods: products, pageTitle: 'Shop', path: '/admin/products', isAuthenticated: req.session.isLoggedIn
            })
        })
        .catch(err => {
            console.log(err)
        })
}

