const Product = require('../models/product')
const Cart = require('../models/cart')


exports.getIndex = (req, res, next) => {
    Product.getAll()
        .then(([rows, tableMeta]) => {
            res.render("shop/product-list", {prods: rows, pageTitle: 'Shop', path: '/'})
        })
        .catch(err => {
            console.log(err)
        })
}

exports.getProducts = (req, res, next) => {
    Product.getAll()
        .then(([rows, tableMeta]) => {
            res.render("shop/product-list", {prods: rows, pageTitle: 'Shop', path: '/products'})
        })
        .catch(err => {
        })
}

exports.getProductDetails = (req, res, next) => {
    const productId = req.params.productId;

    Product.getProductById(productId)
        .then(([product]) =>{
            console.log(product)
            res.render("shop/product-detail", {product: product[0], pageTitle: 'Product Details', path: '/products'})
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
    const displayedProducts = [];
    Product.getAll(allProducts => {
        if (allProducts) {
            Cart.getCart(cartProducts => {
                for (let product of allProducts) {
                    const productInCart = cartProducts.products.find(p => p.id === product.id)
                    if (productInCart) {
                        displayedProducts.push({
                                productData: product,
                                qty: productInCart.qty
                            }
                        )
                    }
                }
                res.render("shop/cart", {pageTitle: 'Cart', path: '/cart', products: displayedProducts})
            })
        }
    })
}
exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    console.log("request sent")
    Product.getProductById(productId, (product) => {
        Cart.addProduct(product.id, product.price)
    })
    res.redirect('/products')
}

exports.postDeleteCartProduct = (req,res,next) => {
    const prodId = req.body.productId
    Product.getProductById(prodId, product =>{
        Cart.deleteProduct(prodId, product.getPrice)
        res.redirect('/cart')
    })
}

