const Joi = require("joi")

const product = Joi.object({
    productId: Joi.string().required(),
    productName: Joi.string().required(),
    productUrl: Joi.string().required(),
    productType: Joi.string().required(),
    price: Joi.string().required(),
})

module.exports = {product}

