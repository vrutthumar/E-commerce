const express = require('express')
const router = express.Router()
const fs = require('fs');
const { signUp, login, emailverification, otpverify, forgotPassword } = require('../controllers/authController');
const authorise = require("./../middleware/jwtAuth")


router.post('/login',login)
router.post('/emailverify',emailverification)
router.post('/otpverify',authorise(["Admin","User"]),otpverify)
router.post('/forgotpassword',authorise(["Admin","User"]),forgotPassword)
router.post('/signup',signUp)



module.exports = router