const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    Id : String,
    username: String,
    email : String,
    password: String,
    mobile : String,
    role: String,
    otp : {type : Number , default : 0}
});

const users = mongoose.model("users", usersSchema);

module.exports = users;