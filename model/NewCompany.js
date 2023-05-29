import mongoose from 'mongoose';

const NewCompanySchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    companyAddress: { type: String, required: true },
    // password: { type: String, required: true },
    // firstTimeLogin: { type: Boolean }
})

module.exports = mongoose.model("NewCompany", NewCompanySchema);