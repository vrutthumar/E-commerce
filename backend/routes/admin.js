const express = require('express')
const router = express.Router()
const fs = require('fs');
const { addUser, addProduct, updateUser, deleteUser, getAllUser, getAllProuct, updateProduct, deleteProduct, getproductID, findAdminDetails, updateAdminProfile, updateAdminPassword, getId, getAllBuyProduct, deliverProduct} = require('../controllers/adminControl');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        req.body.productUrl = file.originalname
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.originalname)
    }
  })
  
const upload = multer({ storage: storage })


router.get('/getadmin/:id',findAdminDetails)
router.post('/updateadminprofile/:id',updateAdminProfile)
router.post('/updatepassword/:id',updateAdminPassword)
router.get('/getalluser',getAllUser)
router.get('/getId/:id',getId)
router.post('/adduser',addUser)
router.patch('/updateuser/:id',updateUser)
router.delete('/deleteuser/:id',deleteUser)
router.get('/getallproduct',getAllProuct)
router.get('/getproductid/:id',getproductID)
router.post('/addproduct',upload.single("productUrl"),addProduct)
router.patch('/updateproduct/:id',upload.single("productUrl"),updateProduct)
router.delete('/deleteproduct/:id',deleteProduct)
router.get('/getallbuyproduct',getAllBuyProduct)
router.delete('/deliverproduct/:id',deliverProduct)



module.exports = router