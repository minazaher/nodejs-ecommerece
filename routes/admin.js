const express = require("express")

const path = require("path")

const shopController = require("../controllers/shopController")
const adminController = require("../controllers/adminController")

const router = express.Router()



router.get('/add-product' ,adminController.getAddProduct)

router.post('/add-product', adminController.postAddProduct)

router.get('/products',adminController.getAdminProducts )

router.get('/edit-product', adminController.getEditProduct)


module.exports = router;
