const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const users = require('../Model/usersSchema');
const products = require('../Model/productSchema');
const buyproducts = require('../Model/buyproductSchema');


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'vrutthumar12@gmail.com',
        pass: 'mnek tqzs knnj mcsw'
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
        const productdata = await buyproducts.find({ orderType: "buy" })

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
        return res.status(200).json({ success: false, data: [], message: 'Intertal Server Error' });
    }
}

const deleteProduct = async (req, res) => {
    try {
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
                from: 'vrutthumar12@gmail.com',
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
        return res.status(200).json({ success: true, data: data1, message: 'Product Updated' });
    } catch (error) {
        return res.status(200).json({ success: false, data: [], message: 'Intertal Server Error' });
        console.log(error);
    }
}

const deleteUser = async (req, res) => {
    try {
        const data1 = await users.deleteOne({ Id: req.params.id })
        return res.status(200).json({ success: true, data: data1, message: 'User Deleted' });
    } catch (error) {
        console.log(error);
        return res.status(200).json({ success: false, data: [], message: 'Intertal Server Error' });
    }
}


module.exports = { findAdminDetails, updateAdminProfile, updateAdminPassword, getAllUser, addUser, getId, updateUser, deleteUser, getAllProuct, addProduct, updateProduct, deleteProduct, getproductID, getAllBuyProduct, deliverProduct };