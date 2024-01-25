const users = require('../Model/usersSchema');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const transaction = require('../Model/transactionSchema');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'vrutthumar12@gmail.com',
        pass: 'mnek tqzs knnj mcsw'
    }
});

const otpGeneraor = () => {
    let otp = ""
    for (let i = 1; i <= 6; i++) {
        otp += Math.floor(Math.random() * 9) + 1;
    }

    return Number(otp)
}

const refrelCodeGenerator = async () => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let refCode = ""
    for (let i = 0; i < 6; ++i) {
        refCode += charset.charAt(Math.floor(Math.random() * charset.length)).toUpperCase();
    }
    let allRefrerId = await users.find()
    allRefrerId = allRefrerId.map(x => x.refralCode)
    if (allRefrerId.length != 0 || allRefrerId.filter(x => x == refCode).length == 0) {
        return refCode
    }
    else {
        refrelCodeGenerator()
    }

}
const signUp = async (req, res) => {
    try {
        if (req.body.role == "Admin" && await users.findOne({ "role": req.body.role })) {
            console
            return res.status(200).json({ success: false, data: [], message: `${req.body.role} Already Exists. Contact Adminstrator` });

        } else {


            const loginData = await users.findOne({ "email": req.body.email, "role": req.body.role })
            if (!loginData) {
                if (req.body.password == req.body.cpassword) {
                    const allUsers = await users.find({ role: req.body.role })
                    const newID = allUsers.length == 0 ? 1 : Number(allUsers[allUsers.length - 1].Id.split(req.body.role == "Admin" ? "A" : "U")[1]) + 1
                    const data = {
                        ...req.body,
                        Id: `${req.body.role == "Admin" ? "A" : "U"}${newID}`,
                        password: await bcrypt.hash(req.body.password, 1),
                        refralCode: await refrelCodeGenerator(),
                        refPerson: req.body.refPerson && req.body.refPerson !== "" ? (await users.findOne({ "refralCode": req.body.refPerson })).Id : ""
                    }
                    const token = jwt.sign({
                        email: data.email,
                        role: data.role
                    }, process.env.SECRET_KEY, { expiresIn: '1h' });
                    const data1 = await users.create(data)
                    const wallet = await transaction.create({
                        Id: data1.Id,
                        walletAmount: 100,
                        transactions: [{ "message": "Joining Bonus", "time": new Date(), "type": "Credited", "amount": 100 }]
                    })
                    if (data1.refPerson !== "") {
                        const walletUpdate = await transaction.findOneAndUpdate(
                            { Id: data1.refPerson },
                            {
                                $inc: { walletAmount: 5 },
                                $push: {
                                    transactions: {
                                        "message": "Referal Bonus", "time": new Date(), "type": "Credited", "amount": 5
                                    }
                                }
                            },
                            { new: true, upsert: true }
                        );


                    }
                    var mailOptions = {
                        from: 'vrutthumar12@gmail.com',
                        to: req.body.email,
                        subject: 'Register To Codeswear.com',
                        html: `<div>Welcome To CodesWear.com !!!</div> <br> <br> <div>Register Successfully</div>`

                    };


                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                    return res.status(200).json({ success: true, data: data1, token, message: `New ${req.body.role} Registered Successfully` });
                }
                else {
                    return res.status(200).json({ success: false, data: [], message: 'Password And Confirm Password Should Match' });

                }
            } else {
                return res.status(200).json({ success: false, data: [], message: 'Email Already Exists' });

            }


        }
    } catch (error) {
        console.log(error);
    }
}


const login = async (req, res) => {
    try {
        let data = await users.findOne({ "email": req.body.email, "role": req.body.role })
        if (data) {
            if (await bcrypt.compare(req.body.password, data.password)) {
                const token = jwt.sign({
                    email: data.email,
                    role: data.role
                }, process.env.SECRET_KEY, { expiresIn: '1h' });
                var mailOptions = {
                    from: 'vrutthumar12@gmail.com',
                    to: data.email,
                    subject: 'Login To Codeswear.com',
                    html: `<div>Welcome To CodesWear.com !!!</div> <br> <br> <div>Login Successfully</div>`
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                return res.status(200).json({ success: true, data: data, token, message: `${data.role} Login Successfull` });
            }
            else {

                return res.status(200).json({ success: false, data: [], message: 'Password Incorrect' });
            }
        }
        else {

            return res.status(200).json({ success: false, data: [], message: 'Email Not Found' });
        }

    } catch (error) {
        console.log(error);
    }
}

const emailverification = async (req, res) => {
    try {

        let data = await users.findOne({ "email": req.body.email })
        if (!data) {
            return res.status(200).json({ status: false, data: [], message: "Email Not Found" })
        }

        const update = await users.findOneAndUpdate({ email: req.body.email }, { $set: { otp: otpGeneraor() } }, { new: true })
        const token = jwt.sign({
            email: update.email,
            role: update.role
        }, process.env.SECRET_KEY, { expiresIn: '120' });
        var mailOptions = {
            from: 'vrutthumar12@gmail.com',
            to: data.email,
            subject: 'Otp Verification',
            html: `<div>Welcome To CodesWear.com !!!</div> <br> <br> <div>${update.otp} is Your Otp for Email Verify</div>`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        return res.status(200).json({ status: true, data: update, token, message: "Email Found" })

    } catch (error) {
        console.log(error)
    }
}
const otpverify = async (req, res) => {
    try {
        const userdata = await users.findOne({ email: req.user, otp: req.body.otp })
        if (!userdata) {
            return res.status(200).json({ status: false, data: [], message: "Otp Not Verified" })
        }
        return res.status(200).json({ status: true, data: [], message: "otp verify" })

    } catch (error) {
        console.log(error)
    }
}


const forgotPassword = async (req, res) => {
    try {
        if (req.body.password == req.body.cpassword) {
            const update = await users.findOneAndUpdate({ "email": req.user }, { $set: { password: await bcrypt.hash(req.body.password, 1) } }, { new: true })
            return res.status(200).json({ success: true, data: update, message: 'Password Updated Successully' });
        } else {

            return res.status(200).json({ success: false, data: update, message: 'Password And Confirm Password Should Match' });
        }
    } catch (error) {
        return res.status(200).json({ success: false, data: [], message: 'Intertal Server Error' });
        console.log(error);
    }
}










module.exports = { signUp, login, emailverification, otpverify, forgotPassword };