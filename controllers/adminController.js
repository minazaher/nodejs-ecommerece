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
    req.user
        .createProduct({
        title: title,
        imgUrl: imgUrl,
        description: description,
        price: price,
    })
        .then((result) =>{
        console.log(result)
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
    Product
        .update({
        title: updatedTitle,
        imgUrl: updatedImageUrl,
        price: updatedPrice,
        description: updatedDesc
    },{ where :{ id: prodId } })
        .then(() =>{
        console.log("Updated Successfully!")
        res.redirect('/admin/products');
    })
        .catch((err) =>{
        console.log(err)
    })
};


exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;

    req.user.getProducts({ where :{ id: prodId } }
    ).then(products =>{
        const product = products[0]
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product
            });
        }).catch(() =>{
        res.redirect('/')
    })

}; 


exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId
    Product.destroy({ where : {id : prodId}})
        .then(() =>{
            res.redirect('/admin/products')
        })
        .catch((err) =>{
            console.log(err)
        })

}


exports.getAdminProducts = (req, res, next) => {
    Product.findAll()
        .then((rows) => {
            res.render("admin/product-list", {prods: rows, pageTitle: 'Shop', path: '/admin/products'})
        })
        .catch(err => {
            console.log(err)
        })
}

