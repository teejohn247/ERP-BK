

import mongoose from 'mongoose';
import moment from 'moment/moment';


const AppraisalGroupSchema = new mongoose.Schema({
    companyName: { type: String },
    companyId: { type: String },
    groupName: { type: String, unique: true },
    description: { type: String },
    groupKpis: [
        {
            kpiId: { type: String },
            kpiName: { type: String },
            kpiDescription: { type: String },
            // profilePics: { type: String },
            ratingId: { type: String },
            ratingName: { type: String },
            // fields: {
            //     type: Map,
            //     of: mongoose.Schema.Types.Mixed,
            // },
            ratingDescription: { type: String },
            remarks: { 
                employeeRating: { type: String },
                // employeeName: { type: String },
                managerRating: { type: String },
                // managerName: { type: String },
                employeeComment: { type: String },
                managerComment: { type: String },
                // managerOverallComment: { type: String },
                // employeeSubmissionDate: { type: String },
                // managerReviewDate:{ type: String },
                // managerSignature: {type: Boolean},
                // employeeSignature: {type: Boolean}
             },
        }
    ],
    // potentialRating: { type: String },
    // overallPerformanceRating: { type: String },
    // generalRemarks: { type: String },
    assignedDesignations:  [{
        designation_id: {
            type: String,
        },
        designation_name: {
            type: String
        },
        date_assigned: {
            type: Date,
            // default: new Date().toISOString() 
        }
    }],
    assignedDepartments:  [{
        department_id: {
            type: String,
        },
        department_name: {
            type: String
        },
        date_assigned: {
            type: Date,
            default: new Date().toISOString() 
        }
    }],
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


module.exports = mongoose.model("AppraisalGroup", AppraisalGroupSchema);