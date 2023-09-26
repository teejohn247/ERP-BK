import mongoose from 'mongoose';

const DesignationSchema = new mongoose.Schema({
    designationName: { type: String, required: true },
    description: { type: String},
    companyId: { type: String, required: true },
    companyName: { type: String, required: true },
    leaveName: { type: String, required: true },
    leaveId: { type: String, required: true },
    noOfLeaveDays: { type: String, required: true },
    paidLeave: { type: Boolean, required: true },
    hmoPackages:
    [{
        hmoName: {
            type: String,
        },
        features: {
            type: Array,
        },
        description: {
            type: String,
        }
    }],
});
module.exports = mongoose.model("Designation", DesignationSchema);