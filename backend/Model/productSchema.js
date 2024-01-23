const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productId : String,
    productName: String,
    productUrl : String,
    productType : String,
    price: String, 
    discription:String 
});

const products = mongoose.model("products", productSchema);

module.exports = products;