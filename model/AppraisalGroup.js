

import mongoose from 'mongoose';
import moment from 'moment/moment';


const AppraisalGroupSchema = new mongoose.Schema({
    companyName: { type: String },
    companyId: { type: String },
    groupName: { type: String, unique: true },
    description: { type: String },
    appraisalPeriodId: { type: String },
    appraisalPeriodName: { type: String },
    appraisalPeriodStartDate: { type: String },
    appraisalPeriodEndDate: { type: String },
    appraisalPeriodActiveDate: { type: String },
    appraisalPeriodInactiveDate: { type: String },
    groupKpis:  [
        {
            kpiId: { type: String },
            kpiName: { type: String },
            kpiDescription: { type: String },
            ratingId: { type: String },
            ratingName: { type: String },
            ratingDescription: { type: String },
            remarks: { 
                employeeRatingId: { type: String },
                employeeName: { type: String },
                managerRatingId: { type: String },
                managerName: { type: String },
                employeeComment: { type: String },
                managerComment: { type: String },
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
            // default: moment().format('L') 
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
            default: moment().format('L') 
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
            default: moment().format('L') 
        }
    }],



}, { timestamps: true });


module.exports = mongoose.model("AppraisalGroup", AppraisalGroupSchema);