const mongoose = require('mongoose');

const orders = new mongoose.Schema({
    productName: String,
    userName : String,
    productId : String, 
    productUrl : String,
    Id : String,
    quantity : {type : Number , default : 1},
    price : String,
    total: Number,
    orderType : String

});

const buyproducts = mongoose.model("buyproducts", orders);

module.exports = buyproducts;