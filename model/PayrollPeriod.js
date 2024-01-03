import mongoose from 'mongoose';

const PayrollPeriodSchema = new mongoose.Schema({
    companyName: { type: String },
    companyId: { type: String },
    payrollPeriodName: { type: String },
    description: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    reference: { type: String },
    status: {type: String, default: 'Pending'},
    date: { type: Date, default: Date.now()},
}, { timestamps: true });


module.exports = mongoose.model("PayrollPeriod", PayrollPeriodSchema);