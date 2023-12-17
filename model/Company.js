import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema({
    companyName: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true  },
    companyAddress: { type: String},
    generalSettings: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
    },
    firstTimeLogin: { type: Boolean },
    activeStatus: { type: Boolean, default: false },
    status: { type: Boolean, default: false },
    isSuperAdmin: { type: Boolean },
    systemRoles:{
        employeeManagement: [
            {
                email: { type: String },
                userName: { type: String },
                userId: { type: String },
                dateTime: { type: String },
            }
        ],
        accounting: [
            {
                email: { type: String },
                userName: { type: String },
                userId: { type: String },
                dateTime: { type: String },
            }
        ],
        projects: [
            {
                email: { type: String },
                userName: { type: String },
                userId: { type: String },
                dateTime: { type: String },
            }
        ],
        crm: [
            {
                email: { type: String },
                userName: { type: String },
                userId: { type: String },
                dateTime: { type: String },
            }
        ],
        supplyChain: [
            {
                email: { type: String },
                userName: { type: String },
                userId: { type: String },
                dateTime: { type: String },
            }
        ],
    }
})

module.exports = mongoose.model("Company", CompanySchema);