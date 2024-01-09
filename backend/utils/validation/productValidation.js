const Joi = require("joi")

const product = Joi.object({
    productName: Joi.string().required(),
    productUrl: Joi.string().required(),
    productType: Joi.string().required(),
    price: Joi.string().required(),
})

module.exports = {product}

