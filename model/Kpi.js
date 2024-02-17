

import mongoose from 'mongoose';

const KpiSchema = new mongoose.Schema({
    companyName: { type: String },
    companyId: { type: String },
    employeeId:{ type: String },
    kpiName: { type: String },
    kpiDescription: { type: String },
    fields: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
    },
    remarks: { 
    employeeRatingId: { type: String },
    employeeName: { type: String },
    managerRatingId: { type: String },
    managerName: { type: String },
    employeeComment: { type: String },
    managerComment: { type: String },
    managerOverallComment: { type: String },
    employeeSubmissionDate: { type: String },
    managerReviewDate:{ type: String },
    managerSignature: {type: Boolean},
    employeeSignature: {type: Boolean},

    
    },
    assignedEmployees:  [{
        employee_id: {
            type: String,
        },
        employee_name: {
            type: String
        },
        date_assigned: {
            type: Date,
            default: new Date().toISOString() 
        }
    }],
}, { timestamps: true });


module.exports = mongoose.model("Kpi", KpiSchema);