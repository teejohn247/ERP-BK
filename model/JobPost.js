import mongoose from 'mongoose';

const JobPostSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now()
    },
    description: { type: String },
    companyId: { type: String, required: true },
    companyName: { type: String, required: true },
    departmentName: { type: String, required: true },
    departmentId: { type: String, required: true },
    openingDate: {type: Date, required: true },
    closingDate: {type: Date, required: true },
    jobType: {type: String, required: true },
    status: {type: String, default: "inactive"},
    hiringManager: {type: String, required: true },
    hiringManagerID: {type: String, required: true },
    applications:[{
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
        selected: {type: Boolean, default: false },
        applicationId: {type: String, required: true },

    }],
    form: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
    },
});

module.exports = mongoose.model("JobPost", JobPostSchema);