const mongoose = require('mongoose');

// User ka blueprint banana
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true //ye field jaruri hai iske bina ID nhi banegi
    },
    email:{
        type: String,
        required: true,
        unique: true // ek email se 2 account nhi ban skte 
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ['student','admin'], //Role sirf in do mein se ek ho skta hai
        default: 'student' //Agar kuch na bata,  toh naya user hamesha student banega
    }
},{timestamps: true});
// timestamps add karne se mongoose apne aap createdat and updateat ki date save kr lega

module.exports = mongoose.model('User', userSchema);