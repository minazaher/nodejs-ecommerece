const Product = require('../models/product')
const mongodb = require("mongodb");

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
    const imgUrl = req.file;
    const description = req.body.description;
    const price = req.body.price;
    console.log(imgUrl)
    const product = new Product({
            title: title,
            price: price,
            description: description,
            imgUrl: "imgUrl",
            userId: req.user._id
        }
    )
    product.save()
        .then((result) => {
            console.log(result)
            res.redirect('/admin/products')
        })
        .catch((err) => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
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
            if (product.userId.toString() !== req.user._id.toString()) {
                return res.redirect('/')
            }
            product.title = updatedTitle
            product.price = updatedPrice
            product.imgUrl = updatedImageUrl
            product.description = updatedDesc
            return product.save().then(() => {
                res.redirect('/admin/products');
            })
        })
        .catch((err) => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
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
            });
        }).catch((err) => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
    })

};


exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId
    Product.deleteOne({_id: prodId, userId: req.user._id})
        .then(() => {
            res.redirect('/admin/products')
        })
        .catch((err) => {
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
    })

}


exports.getAdminProducts = (req, res, next) => {
    Product.find({userId: req.user._id})
        .then((products) => {
            res.render("admin/product-list", {
                prods: products, pageTitle: 'Shop', path: '/admin/products'
            })
        })
        .catch((err) => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}

