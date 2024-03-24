import mongoose from 'mongoose';

const FormSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    companyName: { type: String },
    companyId: { type: String },
    jobTitleID: { type: String },
    jobTitle: { type: String },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    resumeCV: { type: String, required: true },
    coverLetter: { type: String},
    departmentId: { type: String, required: true },
    linkedInUrl: {type: String },
    howDidYouHearAboutUs: {type: String},
    physicalDisability: {type: String},
    ethnicity: {type: String },
    gender: {type: String, required: true },
});

module.exports = mongoose.model("Form", FormSchema);