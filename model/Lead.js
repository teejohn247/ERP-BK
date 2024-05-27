import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema(
  {
    companyId: { type: String, required: true },
    companyName: { type: String, required: true },
    name: { type: String },
    leadPriority: { type: String },
    contactName: { type: String },
    contactId: { type: String },
    leadPriority: { type: String },
    leadScore: { type: String },
    expectedRevenue: { type: String },
    conversionProbability: { type: String },
    leadOwner: { type: String },
    leadOwnerId: { type: String },
    assignedToId: { type: String },
    assignedToName: { type: String },
    source: { type: String },
    description: { type: String },
    tags: [{ type: String }],
    location: { type: String },
    quotations: [
      {
        contactId: { type: String },
        contactName: { type: String },
        currency: { type: String },
        paymentTerms: { type: String },
        itemDetails: [
          {
            item: { type: String },
            description: { type: String },
            quantity: { type: Number },
            unitPrice: { type: Number },
            taxes: { type: Number },
            subTotal: { type: Number },
          },
        ],
        total: { type: Number },

        dateAssigned: {
          type: Date,
          default: new Date().toISOString(),
        },
      },
    ],
    activities: [
      {
        activityType: { type: String },
        note: { type: String },
        attachment: { type: String },
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
