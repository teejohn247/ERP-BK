import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema(
  {
    companyId: { type: String, required: true },
    companyName: { type: String, required: true },
    firstName: { type: String },
    LastName: { type: String },
    leadType: { type: String },
    industry: { type: String },
    leadPriority: { type: String },
    contactName: { type: String },
    contactId: { type: String },
    leadPriority: { type: String },
    leadScore: { type: String },
    expectedRevenue: { type: String },
    conversionProbability: { type: String },
    leadOwner: { type: String },
    leadOwnerId: { type: String },
    assignedAgentId: { type: String },
    assignedAgentName: { type: String },
    source: { type: String },
    description: { type: String },
    tags: [{ type: String }],
    location: { type: String },
    activities: [
      {
        activityType: { type: String },
        note: { type: String },
        date: {
          type: Date,
          default: new Date().toISOString(),
        },
      },
    ],
    notes: [
      {
        note: { type: String },
        attachment: { type: String },
        date: {
          type: Date,
          default: new Date().toISOString(),
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", LeadSchema);