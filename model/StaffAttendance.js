

import { Timestamp } from 'mongodb';
import mongoose from 'mongoose';

const StaffAttendanceSchema = new mongoose.Schema({
    companyName: { type: String },
    companyId: { type: String },
    employeeId:{ type: String },
    employeeName:{ type: String },
    employeeImage:{ type: String },
    departmentId: { type: String,  trim: true },
    department: { type: String, required: true, trim: true },
    checkIn:{ type: Date },
    checkOut:{ type: Date },
    date: {type: Date },
    email: { type: String },
    checkOutBySystem:  { type: Boolean, default: false },
    attendanceStatus: { type: Boolean, default: false },
}, { timestamps: true });


module.exports = mongoose.model("StaffAttendance", StaffAttendanceSchema);