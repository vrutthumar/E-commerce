const users = require('../Model/usersSchema');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const products = require('../Model/productSchema');
const buyproducts = require('../Model/buyproductSchema');
const transaction = require('../Model/transactionSchema');



var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_PASSWORDS
    }
});
const otpGeneraor = () => {
    let otp = ""
    for (let i = 1; i <= 6; i++) {
        otp += Math.floor(Math.random() * 9) + 1;
    }

    return Number(otp)
}

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
        if (req.body.orderType == "buy") {
            const walletAmount = await transaction.findOne({ Id: req.body.Id })
            const productDetails = await products.findOne({ productId: req.body.productId })

            if ((productDetails?.price * req.body.quantity) > walletAmount.walletAmount) {
                return res.status(200).json({ success: false, data: [], message: 'Insuffient Ballance' });
            }
        }
        const product = await buyproducts.findOne({ productId: req.body.productId, Id: req.body.Id, orderType: req.body.orderType })
        if (!product) {
            const buyData = {
                "productId": req.body.productId,
                "Id": req.body.Id,
                "quantity": req.body.quantity,
                "orderType": req.body.orderType
            }
            const productdata = await buyproducts.create(buyData)
            const user = await users.findOne({ Id: req.body.Id })
            if (user.refPerson !== "" && req.body.orderType == "buy") {
                const productDetails = await products.findOne({ productId: req.body.productId })
                const amount = (productDetails?.price * req.body.quantity)
                const increment = (5 / 100) * amount

                const walletUpdate = await transaction.findOneAndUpdate(
                    { Id: user.Id },
                    {
                        $inc: { walletAmount: -amount },
                        $push: {
                            transactions: {
                                "message": "Product Amount", "time": new Date(), "type": "Debited", "amount": amount
                            }
                        }
                    },
                    { new: true, upsert: true }
                );
                const refPersonwalletUpdate = await transaction.findOneAndUpdate(
                    { Id: user.refPerson },
                    {
                        $inc: { walletAmount: increment },
                        $push: {
                            transactions: {
                                "message": "Product Buy Bonus", "time": new Date(), "type": "Credited", "amount": increment
                            }
                        }
                    },
                    { new: true, upsert: true }
                );


            }

            return res.status(200).json({ success: true, data: productdata, message: productdata.orderType == "cart" ? 'Product added To cart' : "Order Placed" });
        }
        else {
            const productUpdate = await buyproducts.findOneAndUpdate({ Id: req.body.Id, productId: req.body.productId, orderType: req.body.orderType }, { $set: { quantity: product.quantity + req.body.quantity } }, { new: true })
            const user = await users.findOne({ Id: req.body.Id })
            if (user.refPerson !== "" && req.body.orderType == "buy") {
                const productDetails = await products.findOne({ productId: req.body.productId })
                const amount = (productDetails?.price * req.body.quantity)
                const increment = (5 / 100) * amount

                const walletUpdate = await transaction.findOneAndUpdate(
                    { Id: user.Id },
                    {
                        $inc: { walletAmount: -amount },
                        $push: {
                            transactions: {
                                "message": "Product Amount", "time": new Date(), "type": "Debited", "amount": amount
                            }
                        }
                    },
                    { new: true, upsert: true }
                );
                const refPersonwalletUpdate = await transaction.findOneAndUpdate(
                    { Id: user.refPerson },
                    {
                        $inc: { walletAmount: increment },
                        $push: {
                            transactions: {
                                "message": "Product Buy Bonus", "time": new Date(), "type": "Credited", "amount": increment
                            }
                        }
                    },
                    { new: true, upsert: true }
                );


            }
            return res.status(200).json({ success: true, data: productUpdate, message: productUpdate.orderType == "cart" ? 'Product added To cart' : "Order Placed" });

        }
    } catch (error) {
        console.log(error);
    }
}

const getUsercart = async (req, res) => {
    try {
        const userCart = await buyproducts.aggregate([
            {
                $match: {
                    Id: req.params.id,
                    orderType: "cart"
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
            }
        ])



        return res.status(200).json({ success: true, data: userCart, message: 'Got User Cart' });
    } catch (error) {
        console.log(error);
    }
}

const updateCart = async (req, res) => {
    try {
        const productdata = await buyproducts.findOne({ "Id": req.body.userId, "productId": req.body.productId })

        const productUpdate = await buyproducts.findOneAndUpdate({ Id: req.body.userId, productId: req.body.productId, orderType: "cart" }, { $set: { quantity: productdata.quantity + req.body.quantity } }, { new: true })
        if (productUpdate.quantity < 1) {
            const data1 = await buyproducts.deleteOne({ "Id": req.body.userId, "productId": req.body.productId })
            return res.status(200).json({ success: true, data: [], message: 'Product Removed To cart' });
        }
        return res.status(200).json({ success: true, data: productUpdate, message: 'Product added To cart' });
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

const cardEmailVerify = async (req, res) => {

    try {
        const transactions = await transaction.findOne({ email: req.body.email, Id: req.params.id })
        if (transactions) {

            const emailverification = await transaction.findOneAndUpdate({ email: req.body.email, Id: req.params.id }, { $set: { otp: otpGeneraor() } }, { new: true })
            var mailOptions = {
                from: process.env.APP_EMAIL,
                to: emailverification.email,
                subject: 'Otp Verification',
                html: `<div>Otp for </div> <br> <br> <div>${emailverification.otp} is Your Otp for Email Verify</div>`
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            console.log("cardEmailVerify  emailverification:", emailverification)
            return res.status(200).json({ success: true, data: emailverification, message: 'Email Sent Successfully' });


        }
        else {
            return res.status(200).json({ success: false, data: [], message: 'Email not found' });

        }
    } catch (error) {
        console.log(error)
    }
}

const addToWallet = async (req, res) => {
    const userdata = await transaction.findOne({ email: req.user, otp: req.body.otp, Id: req.params.id })

    if (userdata) {
        const walletUpdate = await transaction.findOneAndUpdate(
            { Id: req.params.id },
            {
                $inc: { walletAmount: req.body.amount },
                $push: {
                    transactions: {
                        "message": "Money added to wallet", "time": new Date(), "type": "Credited", "amount": req.body.amount
                    }
                }
            },
            { new: true, upsert: true }
        );
        return res.status(200).json({ success: true, data: walletUpdate, message: 'Amount Add Successfully' });

    }
}

module.exports = { findDetails, updateUserPassword, getAllProuct, tshirt, hoodies, stickers, mugs, updateProfile, addCartProduct, getUsercart, updateCart, getWalletInfo, cardEmailVerify, addToWallet };