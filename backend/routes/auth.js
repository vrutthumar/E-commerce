const express = require('express')
const router = express.Router()
const fs = require('fs');
const { signUp, login, emailverification, otpverify, forgotPassword } = require('../controllers/authController');
const authorise = require("./../middleware/jwtAuth")

const validation = require('../utils/validateRequest')


router.post('/login',validation("login"),login)
router.post('/emailverify',validation("emailVerify"),emailverification)
router.post('/otpverify',validation("otpverify"),authorise(["Admin","User"]),otpverify)
router.post('/forgotpassword',validation("forgotPassword"),authorise(["Admin","User"]),forgotPassword)
router.post('/signup',signUp)



module.exports = router