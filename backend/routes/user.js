const express = require('express')
const router = express.Router()
const fs = require('fs');
const { getAllProuct, tshirt, hoodies, stickers, mugs, updateUserPassword, findDetails, updateProfile, addCartProduct, getUsercart, updateCart, getWalletInfo, cardEmailVerify, addToWallet } = require('../controllers/userControl');

router.get('/getuser/:id', findDetails)
router.post('/updateprofile/:id', updateProfile)
router.get('/getallproduct', getAllProuct)
router.get('/tshirts', tshirt)
router.get('/hoodies', hoodies)
router.get('/stickers', stickers)
router.get('/mugs', mugs)
router.post('/updateuserpassword/:id', updateUserPassword)
router.post('/addproduct', addCartProduct)
router.get('/getusercart/:id', getUsercart)
router.post('/updatecart', updateCart)
router.get('/userWalletInfo/:id', getWalletInfo)
router.post('/cardEmailVerify/:id', cardEmailVerify)
router.post('/addToWallet/:id', addToWallet)


module.exports = router