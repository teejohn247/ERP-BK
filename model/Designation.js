import mongoose from 'mongoose';

const DesignationSchema = new mongoose.Schema({
    designationName: { type: String, required: true },
    description: { type: String},
    companyId: { type: String, required: true },
    companyName: { type: String, required: true },
    leaveTypes:
    [{
       leaveId: { type: String},
       leaveName: { type: String},
       noOfLeaveDays: {
            type: String,
        },
       paidLeave: { type: Boolean},

       
    }],
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