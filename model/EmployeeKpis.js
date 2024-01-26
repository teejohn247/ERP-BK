

import mongoose from 'mongoose';

const EmployeeKpiSchema = new mongoose.Schema({
    companyName: { type: String },
    companyId: { type: String },
    employeeId:{ type: String },
    employeeName: { type: String },
    profilePics: { type: String },
    appraisalGroup:{ type: String },
    appraisalPeriodId:{ type: String, required: true },
    matrixScore: { type: Array },
    ratingId: { type: String },
    managerName: { type: String },
    managerId: { type: String },
    managerOverallComment: { type: String },
    employeeSubmissionDate: { type: String, default: new Date().toISOString() },
    managerReviewDate:{ type: String },
    managerSignature: {type: Boolean},
    employeeSignature: {type: Boolean},
    status: {type: String, default: "Awaiting manager approval"},
    kpiDescription: { type: String },
    kpiGroups: {
        type: [mongoose.Schema.Types.Mixed],
    },
    remarks: { 
    employeeRating: { type: String },
    managerRating: { type: String },
    employeeComment: { type: String },
    managerComment: { type: String },
    }
}, { timestamps: true });


module.exports = mongoose.model("EmployeeKpi", EmployeeKpiSchema);