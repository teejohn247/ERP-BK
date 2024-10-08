import mongoose from "mongoose";

const QuotationSchema = new mongoose.Schema(
  {
    companyId: { type: String, required: true },
    companyName: { type: String, required: true },
        contactId: { type: String },
        contactName: { type: String },
        currency: { type: String },
        referenceNumber: { type: String },
        paymentTerms: { type: String },
        expirationDate: { type: String },
        dateCreated: { type: String },

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
   
  { timestamps: true }
);

module.exports = mongoose.model("Quotation", QuotationSchema);
