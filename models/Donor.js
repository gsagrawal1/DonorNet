// models/Donor.js
const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
    id: Number,
    firstName: String,
    lastName: String,
    dateOfBirth:  {type : String, required: true},
    gender: String,
    email: { type: String, required: true, unique: true },
    phone: String,
    bloodType: String,
    weight: String,
    streetAddress: String,
    city: String,
    state: String,
    zipCode: String,
    hasDiabetes: String,
    hasHeartCondition: String,
    hasHypertension: String,
    hasTattoo: String,
    lastDonationDate: String,
    medications: String,
    preferredDays: String,
    preferredTime: String,
    emergencyContact: String,
    emergencyPhone: String,
    additionalNotes: String,
    password: String,
    confirmPassword: String,
    resetOTP: String,
    resetOTPExpiry: Date
  },
  { timestamps: true }
);

const Donor = mongoose.model('Donor', donorSchema);
module.exports = Donor
