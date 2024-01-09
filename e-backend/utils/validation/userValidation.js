const Joi = require("joi")

const user = Joi.object({
   
    username : Joi.string().required(),
    email : Joi.string().email().required(),
    password : Joi.string().required(),
    cpassword : Joi.ref('password'),
    mobile : Joi.number().min(9).max(12).required(),
    role : Joi.string().required(),
    otp : Joi.number().min(1).max(6).required()
})

const login = Joi.object({
    email : Joi.string().email().required(),
    password : Joi.string().required(),
})
const emailVerify = Joi.object({
    email : Joi.string().email().required()
})
const otpverify = Joi.object({
    otp : Joi.number().min(1).max(6).required()
})
const forgotPassword = Joi.object({
    password : Joi.string().required(),
    cpassword : Joi.ref('password')
})

module.exports = {user , login ,emailVerify, otpverify,forgotPassword}