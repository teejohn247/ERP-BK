import mongoose from 'mongoose';

const DesignationSchema = new mongoose.Schema({
    designationName: { type: String, required: true },
    companyId: { type: String, required: true },
    companyName: { type: String, required: true },
})

module.exports = mongoose.model("Designation", DesignationSchema);