const express = require("express")

const router = express.Router()

const shopController = require("../controllers/shopController")
const isAuthenticated = require("../middleware/isAuth")

router.get('/' ,shopController.getIndex)

router.get('/products',shopController.getProducts)

router.get('/products/:productId',shopController.getProductDetails)

router.post('/cart',isAuthenticated, shopController.postCart)

router.get('/cart',isAuthenticated, shopController.getCart)

router.post('/cart-delete-item',isAuthenticated, shopController.postDeleteCartProduct)

router.get('/orders',isAuthenticated, shopController.getOrders)

router.post('/create-order',isAuthenticated, shopController.postOrder)

router.get('/orders/:orderId', isAuthenticated, shopController.getInvoice)

/*
router.get('/checkout',shopController.getCheckout)
*/

module.exports = router