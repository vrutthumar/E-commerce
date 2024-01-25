const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    Id: String,
    walletAmount: Number,
    transactions: Array

});

const transaction = mongoose.model("transaction", transactionSchema);

module.exports = transaction;