const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    Id: String,
    email: String,
    otp: { type: Number, default: 0 },
    walletAmount: Number,
    transactions: Array

});

const transaction = mongoose.model("transaction", transactionSchema);

module.exports = transaction;