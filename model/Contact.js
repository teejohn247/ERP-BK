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
    personalEmail: { type: String },
    ownerId: { type: String },
    ownerName: { type: String },
    jobTitle: { type: String },
    organization: { type: String },
    jobRole: { type: String },
    profilePic: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKoUT6kaiW2c9qcsxtXXDLJWsHwDvTNgaIkSzH7d0mNg&s",
    },
    location: { type: String },
        phone: { type: String },
        address: { type: String },
        city: { type: String },
        state: { type: String },
        postalCode: { type: String },
        country: { type: String },
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
    purchaseOrders: [
      {
        contactId: { type: String },
        contactName: { type: String },
        currency: { type: String },
        paymentTerms: { type: String },
        issuedDate: { type: String },
        deliveryDate: { type: Date },
        associatedQuotation: { type: Date },
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
   invoices: [
      {
        contactId: { type: String },
        contactName: { type: String },
        currency: { type: String },
        paymentTerms: { type: String },
        issuedDate: { type: String },
        deliveryDate: { type: Date },
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
        priority: {type: String },
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
