import mongoose from 'mongoose';

const AceERPSchema = new mongoose.Schema({
    companyName: { type: String, default: 'AceERP'},
    email: { type: String, required: true },
    password: { type: String, required: true },
})

module.exports = mongoose.model("AceERP", AceERPSchema);