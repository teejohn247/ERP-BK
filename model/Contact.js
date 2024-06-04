import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    companyId: { type: String, required: true },
    companyName: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    contactType: { type: String },
    onboardingDate: {type: Date},
    industry: { type: String },
    assignedAgentId: { type: String },
    assignedAgentName: { type: String },
    email: { type: String },
    taxId: { type: String },
    ownerId: { type: String },
    ownerName: { type: String },
    jobTitle: { type: String },
    organization: { type: String },
    jobRole: { type: String },
    tags: [{ type: String }],
    location: { type: String },
    contacts: [
      {
        contactType: { type: String },
        phone: { type: String },
        email: { type: String },
        address: { type: String },
        city: { type: String },
        state: { type: String },
        zip: { type: String },
        country: { type: String },
        dateAssigned: {
          type: Date,
          default: new Date().toISOString(),
        }, 
      },
    ],
    quotations: [
      {
        contactId: { type: String },
        contactName: { type: String },
        currency: { type: String },
        paymentTerms: { type: String },
        expirationDate: { type: String },
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

module.exports = mongoose.model("Contact", ContactSchema);
