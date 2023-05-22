import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    maritalStatus: { type: String },
    religion: { type: String },
    dateOfBirth: { type: String, required: true },
    companyEmail: { type: String, required: true },
    personalEmail: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    gender: { type: String, required: true, trim: true },
    password: { type: String },
    level: { type: String },
    address: { type: String },
    position: { type: String },
    role: { type: String },
    profilePic: { type: String },
    department: { type: String, },
    employmentType: { type: String, required: true },
    employeeCode: { type: String },
    companyAddress: { type: String },
    companyBranch: { type: String },
    nextOfKinFullName: {
        type: String,
    },
    nextOfKinAddress: {
        type: String,
    },
    nextOfKinPhoneNumber: {
        type: String,
    },
    nextOfKinGender: {
        type: String,
    },
    paymentInformation:{
        bankName: {
            type: String,
        },
        bankAddress: {
            type: String,
        },
        accountNumber: {
            type: String,
        },
        accountName: {
            type: String,
        },
        sortCode: {
            type: String,
        },
        TaxIndentificationNumber: {
            type: String,
        },
    },
    leave:
        [{
            leaveId: {
                type: String,
            },
            leaveType: {
                type: String,
            },
            leaveStart: {
                type: String,
            },
            leaveEndDate: {
                type: String,
            },
            daysUsed: {
                type: String,
            },
            leaveApproved: {
                type: Boolean,
                default: false
            },
            leaveAttendedTo: {
                type: Boolean,
                default: false
            }
        }],
    attendance:
        [{
            attendanceDate: {
                type: Date,
            },
            attendanceClockIn: {
                type: String,
            },
            attendanceClockOut: {
                type: String,
            },
            workHours: {
                type: String,
            },
        }],
    salaryHistory:
        [{
            salaryMonth: {
                type: String,
            },
            amount: {
                type: Number,
            },
            tax: {
                type: Number,
            },
            deductables: {
                type: Number,
            },
            totalTakeHome: {
                type: Number,
            },
            salaryDate: {
                type: Date
            },
            bankName: {
                type: String,
            },
            acctNumber: {
                type: String,
            },
            acctName: {
                type: String,
            },
            sortCode: {
                type: String,
            },
        }],

})

module.exports = mongoose.model("Employee", EmployeeSchema);