

import mongoose from 'mongoose';

const AppraisalPeriodSchema = new mongoose.Schema({
    companyName: { type: String },
    companyId: { type: String },
    appraisalPeriodName: { type: String, unique: true },
    description: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    activeDate: { type: String },
    inactiveDate: { type: String },
    active: { type: Boolean,
    default: false },

    

}, { timestamps: true });


module.exports = mongoose.model("AppraisalPeriod", AppraisalPeriodSchema);