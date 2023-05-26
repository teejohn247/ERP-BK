import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    adminEmail: { type: String, required: true },
    password: { type: String, required: true },
    firstTimeLogin: { type: Boolean }
})

module.exports = mongoose.model("Company", CompanySchema);