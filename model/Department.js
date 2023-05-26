import mongoose from 'mongoose';

const DepartmentSchema = new mongoose.Schema({
    departmentName: { type: String, required: true },
    companyId: { type: String, required: true },
    companyName: { type: String, required: true },
})

module.exports = mongoose.model("Department", DepartmentSchema);