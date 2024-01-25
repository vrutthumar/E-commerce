const users = require('../Model/usersSchema');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const products = require('../Model/productSchema');
const { response } = require('express');
const buyproducts = require('../Model/buyproductSchema');
const transaction = require('../Model/transactionSchema');


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'vrutthumar12@gmail.com',
        pass: 'nqpb rntm cigb umvp'
    }
});

const findDetails = async (req, res) => {

    try {
        const user = await users.findOne({ "Id": req.params.id })

        return res.status(200).json({ success: false, data: user, message: 'User Found' });

    } catch (error) {
        console.log(error);
        return res.status(200).json({ success: false, data: [], message: 'Intertal Server Error' });
    }
}
const updateProfile = async (req, res) => {

    try {
        const updateProfile = await users.findOneAndUpdate({ "Id": req.params.id }, { $set: { username: req.body.username, email: req.body.email, mobile: req.body.mobile } }, { new: true })


        return res.status(200).json({ success: true, data: updateProfile, message: 'Profile Updated' });

    } catch (error) {
        console.log(error);
        return res.status(200).json({ success: false, data: [], message: 'Intertal Server Error' });
    }
}


const updateUserPassword = async (req, res) => {

    try {
        const oldpass = await users.findOne({ "Id": req.params.id })
        if (req.body.oldpassword !== req.body.password) {
            if (await bcrypt.compare(req.body.oldpassword, oldpass.password)) {
                if (req.body.password == req.body.cpassword) {

                    const newpass = await users.findOneAndUpdate({ "Id": req.params.id }, { $set: { password: await bcrypt.hash(req.body.password, 1) } }, { new: true })
                    return res.status(200).json({ success: true, data: newpass, message: 'Password Updated Successully' });
                } else {
                    return res.status(200).json({ success: false, data: newpass, message: 'Password And Confirm Password Should Match' });

                }

            }
            else {

                return res.status(200).json({ success: false, data: [], message: 'Old Password does not match' });
            }
        }
        else {
            return res.status(200).json({ success: false, data: [], message: "Old Password And New Password Can't be Same" });

        }
    } catch (error) {
        console.log(error);
        return res.status(200).json({ success: false, data: [], message: 'Intertal Server Error' });
    }
}
// ==========================products===================
const getAllProuct = async (req, res) => {
    try {
        const productdata = await products.find()

        return res.status(200).json({ success: true, data: productdata, message: 'All Product Got' });
    } catch (error) {
        console.log(error);
    }
}

const tshirt = async (req, res) => {
    try {
        const productdata = await products.find({ "productType": "T-Shirt" })

        return res.status(200).json({ success: true, data: productdata, message: 'All T-shirts Got' });
    } catch (error) {
        console.log(error);
    }
}
const hoodies = async (req, res) => {
    try {
        const productdata = await products.find({ "productType": "Hoodies" })

        return res.status(200).json({ success: true, data: productdata, message: 'All Hoodies Got' });
    } catch (error) {
        console.log(error);
    }
}
const stickers = async (req, res) => {
    try {
        const productdata = await products.find({ "productType": "Stickers" })

        return res.status(200).json({ success: true, data: productdata, message: 'All Hoodies Got' });
    } catch (error) {
        console.log(error);
    }
}
const mugs = async (req, res) => {
    try {
        const productdata = await products.find({ "productType": "Mugs" })

        return res.status(200).json({ success: true, data: productdata, message: 'All Hoodies Got' });
    } catch (error) {
        console.log(error);
    }
}


// ============================== buy product ================= // 

const addCartProduct = async (req, res) => {
    try {
        const product = await buyproducts.findOne({ productId: req.body.productId, Id: req.body.Id, orderType: req.body.orderType })
        if (!product) {
            const { username, Id } = await users.findOne({ Id: req.body.Id })
            const { productName, productId, productUrl, price } = await products.findOne({ productId: req.body.productId })

            const buyData = {
                "productName": productName,
                "userName": username,
                "productId": productId,
                "productUrl": productUrl,
                "Id": Id,
                "price": price,
                "total": req.body.quantity * Number(price),
                "quantity": req.body.quantity,
                "orderType": req.body.orderType
            }
            const productdata = await buyproducts.create(buyData)

            return res.status(200).json({ success: true, data: productdata, message: productdata.orderType == "cart" ? 'Product added To cart' : "Order Placed" });
        }
        else {
            const productUpdate = await buyproducts.findOneAndUpdate({ Id: req.body.Id, productId: req.body.productId, orderType: req.body.orderType }, { $set: { quantity: product.quantity + req.body.quantity } }, { new: true })
            const productprice = await buyproducts.findOneAndUpdate({ Id: productUpdate.Id, productId: productUpdate.productId }, { $set: { total: productUpdate.quantity * Number(productUpdate.price) } }, { new: true })

            return res.status(200).json({ success: true, data: productprice, message: productprice.orderType == "cart" ? 'Product added To cart' : "Order Placed" });

        }
    } catch (error) {
        console.log(error);
    }
}

const getUsercart = async (req, res) => {
    try {
        const productdata = await buyproducts.find({ Id: req.params.id, orderType: "cart" })

        return res.status(200).json({ success: true, data: productdata, message: 'Product added To cart' });
    } catch (error) {
        console.log(error);
    }
}

const updateCart = async (req, res) => {
    try {
        const productdata = await buyproducts.findOne({ "Id": req.body.userId, "productId": req.body.productId })

        const productUpdate = await buyproducts.findOneAndUpdate({ Id: req.body.userId, productId: req.body.productId, orderType: "cart" }, { $set: { quantity: productdata.quantity + req.body.quantity } }, { new: true })

        const productprice = await buyproducts.findOneAndUpdate({ Id: req.body.userId, productId: req.body.productId, orderType: "cart" }, { $set: { total: productUpdate.quantity * Number(productUpdate.price) } }, { new: true })
        if (productUpdate.quantity < 1) {
            const data1 = await buyproducts.deleteOne({ "Id": req.body.userId, "productId": req.body.productId })
            return res.status(200).json({ success: false, data: [], message: 'Product Removed To cart' });
        }
        return res.status(200).json({ success: true, data: productprice, message: 'Product added To cart' });
    } catch (error) {
        console.log(error);
    }
}

// get wallet info

const getWalletInfo = async (req, res) => {
    try {
        const userWalletInfo = await transaction.findOne({ Id: req.params.id })
        return res.status(200).json({ success: true, data: userWalletInfo, message: 'Wallet Info get Successfully' });

    } catch (error) {
        console.log(error);

    }
}

module.exports = { findDetails, updateUserPassword, getAllProuct, tshirt, hoodies, stickers, mugs, updateProfile, addCartProduct, getUsercart, updateCart, getWalletInfo };