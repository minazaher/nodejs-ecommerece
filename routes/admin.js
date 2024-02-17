const express = require("express")


const shopController = require("../controllers/shopController")
const adminController = require("../controllers/adminController")

const router = express.Router()



router.get('/add-product' ,adminController.getAddProduct)

router.post('/add-product', adminController.postAddProduct)

router.get('/products',adminController.getAdminProducts )

router.get('/edit-product/:productId', adminController.getEditProduct)

router.post('/edit-product/', adminController.postEditProduct)

router.post('/delete-product', adminController.postDeleteProduct)


module.exports = router;
