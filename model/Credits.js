import mongoose from 'mongoose';

const CreditsSchema = new mongoose.Schema({
    name: { type: String },
    description: { type: String },
}, { timestamps: true });


module.exports = mongoose.model("Credits", CreditsSchema);