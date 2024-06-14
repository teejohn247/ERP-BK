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
  dateOfBirth: { type: String, trim: true },
  personalEmail: { type: String },
  maritalStatus: { type: String },
  phoneNumber: { type: String, trim: true },
  profilePic: {
    type: String,
    default:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKoUT6kaiW2c9qcsxtXXDLJWsHwDvTNgaIkSzH7d0mNg&s",
  },
  address: { type: String, trim: true },
  gender: { type: String, trim: true },
  nextOfKinFullName: {
    type: String,
    trim: true,
  },
  nextOfKinAddress: {
    type: String,
    trim: true,
  },
  nextOfKinPhoneNumber: {
    type: String,
    trim: true,
  },
  nextOfKinGender: {
    type: String,
    trim: true,
  },
  nextOfKinRelationship: {
    type: String,
    trim: true,
  },
  email: { type: String, required: true, trim: true },
  agent: { type: Boolean, default: true, required: true, trim: true },
  nationality: { type: String, trim: true },
    country: { type: String,  trim: true },
    city: { type: String, trim: true },
  departmentId: { type: String,  trim: true },
  department: { type: String, required: true, trim: true },
  employmentType: { type: String, required: true, trim: true },
  companyAddress: { type: String, trim: true },
  companyBranch: { type: String, trim: true },
  position: { type: String, trim: true },
  role: { type: String, trim: true },
  designation: {
    type: String,
  },
  designationId: {
    type: String,
  },
  designationName: { type: String, trim: true },
  roleName: { type: String, trim: true },
  employmentStartDate: { type: String, trim: true },
  managerId: { type: String, trim: true },
  managerName: { type: String, trim: true },
  companyRole: { type: String, trim: true },
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
      // profilePic: {
      //   type: String,
      //   default:
      //     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKoUT6kaiW2c9qcsxtXXDLJWsHwDvTNgaIkSzH7d0mNg&s",
      // },
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
      // profilePic: {
      //   type: String,
      //   default:
      //     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKoUT6kaiW2c9qcsxtXXDLJWsHwDvTNgaIkSzH7d0mNg&s",
      // },
      date: {
        type: Date,
        default: new Date().toISOString(),
      },
    },
  ],
  

});

module.exports = mongoose.model("Agent", AgentSchema);
