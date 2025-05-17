const mongoose = require("mongoose")

const request = new mongoose.Schema({
    name: String,
    email : String,
    contact : String,
    bloodType : String,
    requireDate : Date,
    requireUnit : String,
    requireCity : String,
    requireAddress : String,
    acceptedIds : {
        type : [
            mongoose.Schema.Types.ObjectId
        ]
    }
},{
    timestamps : true
})

const Requests = mongoose.model('Requests', request)
module.exports = Requests