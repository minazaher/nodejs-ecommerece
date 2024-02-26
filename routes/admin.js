const express = require("express")
const {check, body} = require('express-validator')


const isAuthenticated = require("../middleware/isAuth")
const adminController = require("../controllers/adminController")


const router = express.Router()

router.get('/add-product' ,isAuthenticated ,adminController.getAddProduct)

// /admin/add-product => POST
router.post(
    '/add-product',
    [
        body('title')
            .isString()
            .isLength({ min: 3 })
            .trim(),
        body('price').isFloat(),
        body('description')
            .isLength({ min: 5, max: 400 })
            .trim()
    ],
    isAuthenticated,
    adminController.postAddProduct
);

router.get('/products',isAuthenticated ,adminController.getAdminProducts )

router.get('/edit-product/:productId',isAuthenticated , adminController.getEditProduct)

router.post(
    '/edit-product',
    [
        body('title')
            .isString()
            .isLength({ min: 3 })
            .trim(),
        body('price').isFloat(),
        body('description')
            .isLength({ min: 5, max: 400 })
            .trim()
    ],
    isAuthenticated,
    adminController.postEditProduct
);
router.delete('/delete-product/:productId',isAuthenticated , adminController.deleteProduct)

module.exports = router;
