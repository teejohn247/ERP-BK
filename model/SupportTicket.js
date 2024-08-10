import mongoose from "mongoose";

const SupportTicketSchema = new mongoose.Schema(
  {
    companyId: { type: String, required: true },
    companyName: { type: String, required: true },
    ticketNumber: { type: String },
    title: { type: String },
    contactName: { type: String },
    contactId: { type: String },
    ownerId: { type: String },
    associatedPO: {type: String},
    description: {type: String},
    ownerName: { type: String },
    stage: { type: String },
    status: { type: String },
    priority: { type: String },
    closureTime: { type: String },
    attachment: { type: String },
    source: { type: String },
    tags: [{ type: String }],
    creationDate: {
        type: Date,
        default: new Date().toISOString(),
    },
    associatedTicket: { type: String },
    note: { type: String },
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

module.exports = mongoose.model("SupportTicket", SupportTicketSchema);
