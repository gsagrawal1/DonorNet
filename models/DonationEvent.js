const mongoose = require('mongoose')

const donationEvent = new mongoose.Schema({
    hostId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'BloodBanks',
        required : true
    },
    eventName : String,
    city: String,
    address: String,
    eventStart : Date,
    eventEnd: Date,
    eventTime: String
},
{
    timestamps: true
})

const DonationEvent = mongoose.model('DonationEvent', donationEvent)
module.exports = DonationEvent