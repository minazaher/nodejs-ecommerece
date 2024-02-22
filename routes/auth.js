const express = require("express")
const {check, body} = require('express-validator')

const authController = require("../controllers/authController")
const User = require('../models/user')

const router = express.Router()

const INVALID_EMAIL_ERROR_MESSAGE = "This Email is Invalid"
const EMAIL_EXIST_ERROR_MESSAGE = "This Email Already Exists"
const USER_DOES_NOT_EXIST_ERROR_MESSAGE = "There is No User With This Email"
const PASSWORD_ERROR_MESSAGE = "Please Enter a Password with Only Numbers and Text and At Least 5 Characters"
const CONFIRM_PASSWORD_ERROR_MESSAGE = "Passwords Have to Match!"

router.get('/login', authController.getLogin)
router.post('/login',
    check('email', INVALID_EMAIL_ERROR_MESSAGE).isEmail().normalizeEmail(),
    authController.postLogin)

router.get('/signup', authController.getSignup)


router.post('/signup',
    [
        check('email', INVALID_EMAIL_ERROR_MESSAGE)
            .isEmail()
            .normalizeEmail()
            .custom((email, {req}) => {
                return User.findOne({email: email})
                    .then((user) => {
                        if (user)
                            return Promise.reject(EMAIL_EXIST_ERROR_MESSAGE)
                    })
            }),
        body('password', PASSWORD_ERROR_MESSAGE)
            .isLength({min: 8, max: 16})
            .isAlphanumeric()
            .trim(),
        body('confirmPassword', CONFIRM_PASSWORD_ERROR_MESSAGE)
            .trim()
            .custom((value, {req}) => value === req.body.password)

    ],
    authController.postSignup
)
router.post('/logout', authController.postLogout)
router.get('/reset', authController.getReset)

router.post('/reset', authController.postReset)

router.get('/reset/:token', authController.getNewPassword)

router.post('/new-password', authController.postNewPassword)


module.exports = router;
