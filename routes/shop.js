const express = require("express")

const router = express.Router()

const shopController = require("../controllers/shopController")

router.get('/' ,shopController.getIndex)

router.get('/products',shopController.getProducts)


router.get('/products/delete')

router.get('/products/:productId',shopController.getProductDetails)

router.post('/cart',shopController.postCart)

router.get('/cart',shopController.getCart)

router.post('/cart-delete-item',shopController.postDeleteCartProduct)

router.get('/orders',shopController.getOrders)

router.post('/create-order',shopController.postOrder)
/*
router.get('/checkout',shopController.getCheckout)
*/

module.exports = router