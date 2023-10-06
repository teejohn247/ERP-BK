import mongoose from 'mongoose';

const DesignationSchema = new mongoose.Schema({
    designationName: { type: String, required: true },
    description: { type: String},
    companyId: { type: String, required: true },
    companyName: { type: String, required: true },
    grade: { type: Number, required: true },
    leaveTypes:
    [{
       leaveTypeId: { type: String},
       leaveName: { type: String},
       noOfLeaveDays: {
            type:Number,
        },
        description:{
            type: String,
        },
        daysUsed:{
            type:Number,
            default: 0
        }
    }],
    expenseCard:
    [{
        cardCurrency: {
            type: String,
            required: true
        },
        cardLimit: { type: String, required: true},
        cardExpiryDate: { type: String, required: true },
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