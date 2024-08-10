import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema(
  {
    companyId: { type: String, required: true },
    companyName: { type: String, required: true },
    firstName: { type: String },
    LastName: { type: String },
    leadType: { type: String },
    industry: { type: String },
    jobTitle: { type: String },
    leadPriority: { type: String },
    contactName: { type: String },
    contactId: { type: String },
    contactType: { type: String },
    onboardingDate: { type: String },
    jobRole: { type: String },
    email: { type: String },
    phoneNumber: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    postCode: { type: String },
    officeLocation: { type: String },









    leadPriority: { type: String },
    leadScore: { type: String },
    expectedRevenue: { type: String },
    conversionProbability: { type: String },
    leadOwner: { type: String },
    leadOwnerId: { type: String },
    contactOwner: { type: String },
    contactOwnerId: { type: String },
    assignedAgentId: { type: String },
    assignedAgentName: { type: String },
    source: { type: String },
    description: { type: String },
    location: { type: String },
    profilePic: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKoUT6kaiW2c9qcsxtXXDLJWsHwDvTNgaIkSzH7d0mNg&s",
    },
    activities: [
      {
        activityType: { type: String },
        note: { type: String },
        activityDateTime: {
          type: Date,
        },
        priority: {
          type: String,
        },
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
        priority: {type: String },
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
