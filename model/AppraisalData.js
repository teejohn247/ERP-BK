import mongoose from 'mongoose';

const appraisalDataSchema = new mongoose.Schema({
    companyName: { type: String },
    companyId: { type: String },
    employeeId:{ type: String },
    email:{ type: String },
    firstName: { type: String },
    lastName: { type: String },
    fullName: { type: String },
    profilePic: { type: String },
    appraisalPeriodId: { type: mongoose.Schema.Types.ObjectId, ref: 'AppraisalPeriod' },
    role: { type: String },
    department:{ type: String },
    designation:{ type: String },
    kpiGroups: [{
      type: mongoose.Schema.Types.Mixed
  }]
}, { timestamps: true })


module.exports = mongoose.model("appraisalData", appraisalDataSchema);