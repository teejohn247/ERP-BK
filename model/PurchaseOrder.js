import mongoose from "mongoose";

const PurchaseOrderSchema = new mongoose.Schema(
  {
    companyId: { type: String, required: true },
    companyName: { type: String, required: true },
    contactId: { type: String },
    contactName: { type: String },
    currency: { type: String },
    paymentTerms: { type: String },
    issuedDate: { type: String },
    dateRequested:{ type: String },
    deliveryDate: { type: Date },
    associatedQuotation: { type: Date,
    },
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

module.exports = mongoose.model("PurchaseOrder", PurchaseOrderSchema);
