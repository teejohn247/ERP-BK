

import mongoose from 'mongoose';

const AuditTrailSchema = new mongoose.Schema({
    companyName: { type: String },
    companyId: { type: String },
    humanResources: [
        {
            userEmail: { type: String },
            userName: { type: String },
            action: { type: String },
            dateTime: { type: String },
        }
    ],
    accounting: [
        {
            userEmail: { type: String },
            userName: { type: String },
            action: { type: String },
            dateTime: { type: String },
        }
    ],
    projects: [
        {
            userEmail: { type: String },
            userName: { type: String },
            action: { type: String },
            dateTime: { type: String },
        }
    ],
    crm: [
        {
            userEmail: { type: String },
            userName: { type: String },
            action: { type: String },
            dateTime: { type: String },
        }
    ],
    supplyChain: [
        {
            userEmail: { type: String },
            userName: { type: String },
            action: { type: String },
            dateTime: { type: String },
        }
    ],
}, { timestamps: true });


module.exports = mongoose.model("AuditTrail", AuditTrailSchema);