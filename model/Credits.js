import mongoose from 'mongoose';

const CreditsSchema = new mongoose.Schema({
    companyId: { type: String, required: true },
    companyName: { type: String, required: true },
    name: { type: String },
    description: { type: String },
}, { timestamps: true });


module.exports = mongoose.model("Credits", CreditsSchema);