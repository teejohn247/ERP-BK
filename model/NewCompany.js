import mongoose from 'mongoose';

const NewCompanySchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    companyAddress: { type: String, required: true },
    generalSettings: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
    },
})

module.exports = mongoose.model("NewCompany", NewCompanySchema);