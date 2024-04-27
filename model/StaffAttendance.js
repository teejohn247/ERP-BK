

import { Timestamp } from 'mongodb';
import mongoose from 'mongoose';

const StaffAttendanceSchema = new mongoose.Schema({
    companyName: { type: String },
    companyId: { type: String },
    employeeId:{ type: String },
    employeeName:{ type: String },
    departmentId: { type: String,  trim: true },
    department: { type: String, required: true, trim: true },
    checkIn:{ type: Date },
    checkOut:{ type: Date },
    email: { type: String },
    checkedInStatus: { type: String, default: "Inactive" },
}, { timestamps: true });


module.exports = mongoose.model("StaffAttendance", StaffAttendanceSchema);