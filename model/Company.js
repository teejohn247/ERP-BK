import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema({
    companyName: { type: String },
    adminEmail: { type: String, required: true },
    password: { type: String, required: true  },
    companyAddress: { type: String},
    generalSettings: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
    },
    firstTimeLogin: { type: Boolean },
    systemRoles:{
        humanResources: [
            {
                userEmail: { type: String },
                userName: { type: String },
                userId: { type: String },
                dateTime: { type: String },
            }
        ],
        accounting: [
            {
                userEmail: { type: String },
                userName: { type: String },
                userId: { type: String },
                dateTime: { type: String },
            }
        ],
        projects: [
            {
                userEmail: { type: String },
                userName: { type: String },
                userId: { type: String },
                dateTime: { type: String },
            }
        ],
        crm: [
            {
                userEmail: { type: String },
                userName: { type: String },
                userId: { type: String },
                dateTime: { type: String },
            }
        ],
        supplyChain: [
            {
                userEmail: { type: String },
                userName: { type: String },
                userId: { type: String },
                dateTime: { type: String },
            }
        ],
    }
})

module.exports = mongoose.model("Company", CompanySchema);