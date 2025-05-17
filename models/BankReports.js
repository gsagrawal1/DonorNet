const mongoose = require('mongoose');

const bankReportSchema = new mongoose.Schema({
  bankId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'BloodBank',
    required: true
  },
  bloodInventory: {
    A_pos: { type: Number, default: 0 },   // A+
    A_neg: { type: Number, default: 0 },   // A-
    B_pos: { type: Number, default: 0 },   // B+
    B_neg: { type: Number, default: 0 },   // B-
    AB_pos: { type: Number, default: 0 },  // AB+
    AB_neg: { type: Number, default: 0 },  // AB-
    O_pos: { type: Number, default: 0 },   // O+
    O_neg: { type: Number, default: 0 }    // O-
  }
}, { timestamps: true }); 

const BankReport = mongoose.model('BankReport', bankReportSchema);
module.exports = BankReport;
