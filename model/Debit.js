import mongoose from 'mongoose';

const DebitSchema = new mongoose.Schema({
    name: { type: String },
    description: { type: String },
}, { timestamps: true });


module.exports = mongoose.model("Debit", DebitSchema);