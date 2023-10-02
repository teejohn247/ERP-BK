import mongoose from 'mongoose';

const DesignationSchema = new mongoose.Schema({
    designationName: { type: String, required: true },
    description: { type: String},
    companyId: { type: String, required: true },
    companyName: { type: String, required: true },
    leaveTypes:
    [{
       leaveTypeId: { type: String},
       leaveName: { type: String},
       noOfLeaveDays: {
            type: String,
        }
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