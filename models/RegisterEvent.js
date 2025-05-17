const mongoose = require('mongoose')

const registerEvent = new mongoose.Schema({
    eventId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "DonationEvent",
        required : true
    },
    fullname : String,
    email: String,
    contact : String,
    age: Number,
    bloodtype: String
},{
    timestamps: true
})

const RegisterEvent = mongoose.model('RegisterEvent', registerEvent)
module.exports = RegisterEvent