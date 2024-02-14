import mongoose from 'mongoose';

const appraisalDataSchema = new mongoose.Schema({
    // companyName: { type: String },
    // companyId: { type: String },
    // employeeId:{ type: String },
    email:{ type: String },
    firstName: { type: String },
    lastName: { type: String },
    fullName: { type: String },
    profilePic: { type: String },
    appraisalPeriodName: { type: String },

    // role: { type: String },
    department:{ type: String },
    designation:{ type: String },
    companyName: { type: String },
    companyId: { type: String },
    companyRole: { type: String },

    employeeId:{ type: String },
    employeeName: { type: String },
    profilePics: { type: String },
    appraisalGroup:{ type: String },
    appraisalPeriodId:{ type: String, required: true },
    matrixScore: { type: Array },
    ratingId: { type: String },
    managerName: { type: String },
    managerId: { type: String },
    email: { type: String },
    employeeKpiId: { type: String },

    startDate: { type: String },
    endDate: { type: String },
    activeDate: { type: String },
    inactiveDate: { type: String },

    managerOverallComment: { type: String },
    employeeSubmissionDate: { type: String, default: new Date().toISOString() },
    managerReviewDate:{ type: String },
    managerSignature: {type: Boolean},
    employeeSignature: {type: Boolean},
    status: {type: String, default: "Awaiting Manager Review"},
    kpiDescription: { type: String },

    kpiGroups: [{
      type: mongoose.Schema.Types.Mixed
  }]
}, { timestamps: true })


module.exports = mongoose.model("appraisalData", appraisalDataSchema);  