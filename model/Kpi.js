

import mongoose from 'mongoose';

const KpiSchema = new mongoose.Schema({
    companyName: { type: String },
    companyId: { type: String },
    kpiName: { type: String },
    kpiDescription: { type: String },
    remarks: { 
        employeeRatingId: { type: String, default: "" },
        employeeName: { type: String, default: "" },
        managerRatingId: { type: String, default: "" },
        managerName: { type: String, default: "" },
        employeeComment: { type: String, default: "" },
        managerComment: { type: String, default: "" },
     },

}, { timestamps: true });


module.exports = mongoose.model("Kpi", KpiSchema);