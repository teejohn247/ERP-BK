

import { Timestamp } from 'mongodb';
import mongoose from 'mongoose';

const VisitorSchema = new mongoose.Schema({
    companyName: { type: String },
    companyId: { type: String },
    employeeId:{ type: String },
    employeeName:{ type: String },
    guestName:{ type: String },
    checkIn:{ type: Date },
    checkOut:{ type: Date },
    purpose:{ type: String },
    visitDate:{ type: Date },
}, { timestamps: true });


module.exports = mongoose.model("Visitor", VisitorSchema);