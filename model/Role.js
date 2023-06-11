import mongoose from 'mongoose';

const RoleSchema = new mongoose.Schema({
    roleName: { type: String, required: true },
    companyId: { type: String, required: true },
    companyName: { type: String, required: true },
    // leaveType:
    //     [{
    //         leaveName: {
    //             type: String,
    //         },
    //         noOfDays: {
    //             type: String,
    //         },
    //         paid: {
    //             type:Boolean,
    //         },
    //     }],
    //     hmoPackages:
    //     [{
    //         hmoName: {
    //             type: String,
    //         },
    //         features: {
    //             type: Array,
    //         },
    //         description: {
    //             type: String,
    //         }
    //     }],
})

module.exports = mongoose.model("Role", RoleSchema);