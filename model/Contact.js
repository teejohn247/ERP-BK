import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    companyId: { type: String, required: true },
    companyName: { type: String, required: true },
    name: { type: String },
    email: { type: String },
    taxId: { type: String },
    ownerId: { type: String },
    ownerName: { type: String },
    jobTitle: { type: String },
    organization: { type: String },
    buyingRole: { type: String },
    tags: [{ type: String }],
    location: { type: String },
    contacts: [
      {
        contactType: { type: String },
        phone: [
          {
            phoneNumber: { type: String },
            primary: { type: Boolean, default: false },
          },
        ],
        email: [
          {
            address: { type: String },
            primary: { type: Boolean, default: false },
          },
        ],
        address: [
          {
            address: { type: String },
            primary: { type: Boolean, default: false },
          },
        ],
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

module.exports = mongoose.model("Contact", ContactSchema);
