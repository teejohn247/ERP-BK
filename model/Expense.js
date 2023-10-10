import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
    expenseCardName: { type: String },
    description: { type: String },
    companyId: { type: String, required: true },
    companyName: { type: String, required: true },
});

module.exports = mongoose.model("Expense", ExpenseSchema);