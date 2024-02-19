const express = require("express")


const isAuthenticated = require("../middleware/isAuth")
const adminController = require("../controllers/adminController")


const router = express.Router()



router.get('/add-product' ,isAuthenticated ,adminController.getAddProduct)

router.post('/add-product',isAuthenticated , adminController.postAddProduct)

router.get('/products',isAuthenticated ,adminController.getAdminProducts )

router.get('/edit-product/:productId',isAuthenticated , adminController.getEditProduct)

router.post('/edit-product/',isAuthenticated , adminController.postEditProduct)

router.post('/delete-product',isAuthenticated , adminController.postDeleteProduct)

module.exports = router;
