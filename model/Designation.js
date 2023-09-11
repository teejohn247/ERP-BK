import mongoose from 'mongoose';

const DesignationSchema = new mongoose.Schema({
    designationName: { type: String, required: true, unique: true },
    companyId: { type: String, required: true },
    companyName: { type: String, required: true },
    leaveTypes:
    [{
        leaveName: {
            type: String,
        },
        noOfDays: {
            type: String,
        },
        paid: {
            type:Boolean,
        },
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
})

module.exports = mongoose.model("Designation", DesignationSchema);