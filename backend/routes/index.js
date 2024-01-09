const express = require('express')
const router = express.Router()

const admin = require('./admin')
const user = require('./user')
const auth = require('./auth')
const authorise = require("./../middleware/jwtAuth")


router.use('/auth', auth);
router.use('/admin',authorise(["Admin"]),admin);
router.use('/user',authorise(["User"]),user);


module.exports = router