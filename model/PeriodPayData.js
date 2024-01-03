import mongoose from 'mongoose';

const periodPayDataSchema = new mongoose.Schema({
    companyName: { type: String },
    companyId: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    fullName: { type: String },
    profilePic: { type: String },
    payrollPeriodId: { type: mongoose.Schema.Types.ObjectId, ref: 'PayrollPeriod' },
    role: { type: String },
    department:{ type: String },
    designation:{ type: String },
    bonus: { type: Number, default: 0 },
    standard: { type: Number, default: 0 },
    basicPay: { type: Number, default: 0 },
    pension: { type: Number, default: 0 },
    insurance: { type: Number, default: 0 },
    payeTax: { type: Number, default: 0 },
    netPay: { type: Number, default: 0 },
    grossPay: { type: Number, default: 0 },
    status: {type: String, default: 'Pending'},
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true })


module.exports = mongoose.model("periodPayData", periodPayDataSchema);