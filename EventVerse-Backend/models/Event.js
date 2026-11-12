const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    date:{
        type: String,   //kab hone wala hai
    },
    location:{
        type: String,
        required: true
    },
    totalSeats:{
        type: String,
        required: true
    },

    //important ye ek array hai jisme hum un users ki 'ID' save karenge jihone seat book ki h 
    //isey 'Relational Data' kehte h. hum pura user data save nhi kr rahe , sirf uski unique ID save kr rahe h 
    bookedStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // ye mongoDB ko batata h ki ye ID 'User' model se aayi hai
    }]
    },{timestamps: true});

    module.exports = mongoose.model('Event', eventSchema);