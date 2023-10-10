import mongoose from 'mongoose';

const ExpenseRequestsSchema = new mongoose.Schema({
    employeeId: { type: String, required: true },
    employeeName: { type: String, required: true },
    expenseTypeId: { type: String, required: true },
    expenseTypeName: { type: String, required: true },
    expenseDate: { type: String, required: true },
    currency: { type: String },
    amount: { type: String, required: true },
    attachment: { type: String },
    approver: { type: String },
    approverId: { type: String },
    dateRemitted: { type: String, default: Date.now() },
    description: { type: String },
    companyId: { type: String, required: true },
    companyName: { type: String, required: true },
});

module.exports = mongoose.model("ExpenseRequests", ExpenseRequestsSchema);