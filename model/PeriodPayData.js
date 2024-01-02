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
    bonus: { type: Number },
    standard: { type: Number },
    basicPay: { type: Number },
    pension: { type: Number },
    insurance: { type: Number },
    payeTax: { type: Number },
    status: {type: String, default: 'Pending'},
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true })


module.exports = mongoose.model("periodPayData", periodPayDataSchema);