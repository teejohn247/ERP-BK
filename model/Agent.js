import { string } from "joi";
import mongoose from "mongoose";
import moment from "moment";

const AgentSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  companyId: { type: String, required: true },
  activeStatus: { type: Boolean, default: false },
  password: { type: String },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  fullName: { type: String, trim: true },
  phoneNumber: { type: String, trim: true },
  profilePic: {
    type: String,
    default:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKoUT6kaiW2c9qcsxtXXDLJWsHwDvTNgaIkSzH7d0mNg&s",
  },
  address: { type: String, trim: true },
  gender: { type: String, trim: true },
  email: { type: String, required: true, trim: true },
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
 leads: [
    {
      leadId: { type: String },
      fullName: { type: String },
      profilePic: {
        type: String,
        default:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKoUT6kaiW2c9qcsxtXXDLJWsHwDvTNgaIkSzH7d0mNg&s",
      },
      date: {
        type: Date,
      },
    },
  ],
  tickets: [
    {
      ticketId: { type: String },
      notes: { type: String },
      ticketNumber: { type: String },
      stage: { type: String },
      status: { type: String },
      priority: { type: String },
      closureTime: { type: String },
      date: {
        type: Date,
      },
    },
  ],
  contacts: [
    {
      contactId: { type: String },
      fullName: { type: String },
      profilePic: {
        type: String,
        default:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKoUT6kaiW2c9qcsxtXXDLJWsHwDvTNgaIkSzH7d0mNg&s",
      },
      date: {
        type: Date,
        default: new Date().toISOString(),
      },
    },
  ],
  

});

module.exports = mongoose.model("Agent", AgentSchema);
