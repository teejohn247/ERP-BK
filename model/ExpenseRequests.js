import mongoose from 'mongoose';
import moment from 'moment';

const ExpenseRequestsSchema = new mongoose.Schema({
    employeeId: { type: String, required: true },
    employeeName: { type: String, required: true },
    expenseTypeId: { type: String, required: true },
    expenseTypeName: { type: String, required: true },
    expenseDate: { type: String, required: true },
    amount: { type: String, required: true },
    attachment: { type: String },
    approver: { type: String },
    approverId: { type: String },
    dateRemitted: { type: String },
    description: { type: String },
    companyId: { type: String, required: true },
    companyName: { type: String, required: true },
    status: { type: String, default: "Pending" },
    dateRequested: { type: String, default: moment().format('L') },
    comment: { type: String },
    dateOfApproval: { type: String},
});

module.exports = mongoose.model("ExpenseRequests", ExpenseRequestsSchema);