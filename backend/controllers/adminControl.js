const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const users = require('../Model/usersSchema');
const products = require('../Model/productSchema');
const buyproducts = require('../Model/buyproductSchema');
const fs = require('fs');
const transaction = require('../Model/transactionSchema');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_PASSWORDS
    }
});

const findAdminDetails = async (req, res) => {

    try {
        const adminDetail = await users.findOne({ "Id": req.params.id })

        return res.status(200).json({ success: true, data: adminDetail, message: 'Admin Found' });

    } catch (error) {
        console.log(error);
        return res.status(200).json({ success: false, data: [], message: 'Intertal Server Error' });
    }
}
const updateAdminProfile = async (req, res) => {

    try {
        const updateProfile = await users.findOneAndUpdate({ "Id": req.params.id }, { $set: { username: req.body.username, email: req.body.email, mobile: req.body.mobile } }, { new: true })

        return res.status(200).json({ success: true, data: updateProfile, message: 'Profile Updated' });

    } catch (error) {
        console.log(error);
        return res.status(200).json({ success: false, data: [], message: 'Intertal Server Error' });
    }
}


const updateAdminPassword = async (req, res) => {

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



// ===========================Product Apis ========================= //
const getAllBuyProduct = async (req, res) => {
    try {
        const productdata = await buyproducts.aggregate([
            {
                $match: {
                    "orderType": "buy"
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "productId",
                    as: "productDetails"
                }
            },
            {
                $addFields: {
                    productDetails: {
                        $first: "$productDetails"
                    }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "Id",
                    foreignField: "Id",
                    as: "userDetails"
                }
            },
            {
                $addFields: {
                    userDetails: {
                        $first: "$userDetails"
                    }
                }
            }
        ])

        return res.status(200).json({ success: true, data: productdata, message: 'All Product Got' });
    } catch (error) {
        console.log(error);
    }
}

const deliverProduct = async (req, res) => {
    try {

        const data1 = await buyproducts.deleteOne({ "productId": req.params.id })

        return res.status(200).json({ success: true, data: data1, message: 'Product Send For Delivery' });
    } catch (error) {
        console.log(error);
        return res.status(200).json({ success: false, data: [], message: 'Intertal Server Error' });
    }
}

const getAllProuct = async (req, res) => {
    try {
        const productdata = await products.find()

        return res.status(200).json({ success: true, data: productdata, message: 'All Product Got' });
    } catch (error) {
        console.log(error);
    }
}



const addProduct = async (req, res) => {
    try {
        const allproducts = await products.find()
        const newID = users.length == 0 ? 1 : Number(allproducts[allproducts.length - 1].productId.split('P')[1]) + 1
        const data = {
            ...req.body,
            productId: `P${newID}`,
        }
        const productdata = await products.create(data)
        return res.status(200).json({ success: true, data: productdata, message: 'Product Added' });
    } catch (error) {
        fs.unlinkSync(`./public/uploads/${req.body.productUrl}`)
        console.log(error);
    }
}

const getproductID = async (req, res) => {
    try {
        const product = await products.findOne({ "productId": req.params.id })
        return res.status(200).json({ success: true, data: product, message: 'Product Got' });
    } catch (error) {
        console.log(error);
        return res.status(200).json({ success: false, data: [], message: 'Intertal Server Error' });
    }
}



const updateProduct = async (req, res) => {
    try {
        const update = await products.findOneAndUpdate({ "productId": req.params.id }, { $set: req.body }, { new: true })
        return res.status(200).json({ success: true, data: update, message: 'Product Updated' });
    } catch (error) {
        console.log(error);
        fs.unlinkSync(`./public/uploads/${req.body.productUrl}`)
        return res.status(200).json({ success: false, data: [], message: 'Intertal Server Error' });
    }
}

const deleteProduct = async (req, res) => {
    try {
        const product = await products.findOne({ "productId": req.params.id })
        const img = fs.unlinkSync(`./public/uploads/${product.productUrl}`)
        const data1 = await products.deleteOne({ "productId": req.params.id })
        return res.status(200).json({ success: true, data: data1, message: 'Product Deleted' });
    } catch (error) {
        console.log(error);
        return res.status(200).json({ success: false, data: [], message: 'Intertal Server Error' });
    }
}


// ==============================Users Api ========================//
const getAllUser = async (req, res) => {
    try {
        const productdata = await users.find({ role: "User" }, { password: 0 })

        return res.status(200).json({ success: true, data: productdata, message: 'All Product Got' });
    } catch (error) {
        console.log(error);
    }
}

const addUser = async (req, res) => {
    try {
        const loginData = await users.findOne({ "email": req.body.email })
        if (!loginData) {
            const allusers = await users.find({ role: "User" })
            const newID = allusers.length == 0 ? 1 : Number(allusers[allusers.length - 1].Id.split('U')[1]) + 1
            const data = {
                ...req.body,
                Id: `U${newID}`,
                password: await bcrypt.hash(req.body.password, 1)
            }
            const data1 = await users.create(data)
            var mailOptions = {
                from: process.env.APP_EMAIL,
                to: req.body.email,
                subject: 'Register To Codeswear.com',
                html: `<div>Welcome To CodesWear.com !!!</div> <br> <br> <div>Register Successfully</div> <br> <br> <div>Email ${req.body.email}</div> <br> <br> <div>Password ${req.body.password}</div> <br> <br> <div>Please Don't Share Your credential with Any One</div>`

            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            return res.status(200).json({ success: true, data: data1, message: 'User Created' });

        } else {
            return res.status(200).json({ success: false, data: [], message: 'Email Already Exists' });

        }
    } catch (error) {
        console.log(error);
    }
}


const getId = async (req, res) => {
    try {
        const user = await users.findOne({ Id: req.params.id }, { password: 0 })
        return res.status(200).json({ success: true, data: user, message: 'User Got' });
    } catch (error) {
        console.log(error);
        return res.status(200).json({ success: false, data: [], message: 'Intertal Server Error' });
    }
}



const updateUser = async (req, res) => {
    try {
        const update = await users.findOneAndUpdate({ Id: req.params.id }, { $set: req.body })
        return res.status(200).json({ success: true, data: update, message: 'Product Updated' });
    } catch (error) {
        return res.status(200).json({ success: false, data: [], message: 'Intertal Server Error' });
        console.log(error);
    }
}

const deleteUser = async (req, res) => {
    try {
        const userDelete = await users.deleteOne({ Id: req.params.id })
        const walletDelete = await transaction.deleteOne({ Id: req.params.id })
        return res.status(200).json({ success: true, data: userDelete, message: 'User Deleted' });
    } catch (error) {
        console.log(error);
        return res.status(200).json({ success: false, data: [], message: 'Intertal Server Error' });
    }
}

// Wallet Info

const walletInfo = async (req, res) => {
    try {
        const data1 = await transaction.find()
        return res.status(200).json({ success: true, data: data1, message: 'User Deleted' });
    } catch (error) {
        console.log(error);
        return res.status(200).json({ success: false, data: [], message: 'Intertal Server Error' });
    }
}

const getWalletInfo = async (req, res) => {
    try {
        const userWalletInfo = await transaction.findOne({ Id: req.params.id })
        return res.status(200).json({ success: true, data: userWalletInfo, message: 'Wallet Info get Successfully' });

    } catch (error) {
        console.log(error);

    }
}

module.exports = { findAdminDetails, updateAdminProfile, updateAdminPassword, getAllUser, addUser, getId, updateUser, deleteUser, getAllProuct, addProduct, updateProduct, deleteProduct, getproductID, getAllBuyProduct, deliverProduct, walletInfo, getWalletInfo };