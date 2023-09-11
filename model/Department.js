import mongoose from 'mongoose';

const DepartmentSchema = new mongoose.Schema({
    departmentName: { type: String, required: true, unique: true },
    companyId: { type: String, required: true },
    companyName: { type: String, required: true },
    managerId:  { type: String},
    managerName: { type: String}
})
DepartmentSchema.index({ companyId: 1, departmentName: 1 }, { unique: true });
module.exports = mongoose.model("Department", DepartmentSchema);