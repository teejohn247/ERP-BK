import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema({
    companyName: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true  },
    companyAddress: { type: String},
    companyLogo: { type: String, default: ''},
    generalSettings: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
    },
    firstTimeLogin: { type: Boolean },
    activeStatus: { type: Boolean, default: false },
    status: { type: Boolean, default: false },
    isSuperAdmin: { type: Boolean },
    parollPeriodFrequency: { type: String },
    systemRoles:{
        employeeManagement: [
            {
                email: { type: String },
                userName: { type: String },
                userId: { type: String },
                dateTime: { type: String },
            }
        ],
        accounting: [
            {
                email: { type: String },
                userName: { type: String },
                userId: { type: String },
                dateTime: { type: String },
            }
        ],
        projects: [
            {
                email: { type: String },
                userName: { type: String },
                userId: { type: String },
                dateTime: { type: String },
            }
        ],
        crm: [
            {
                email: { type: String },
                userName: { type: String },
                userId: { type: String },
                dateTime: { type: String },
            }
        ],
        supplyChain: [
            {
                email: { type: String },
                userName: { type: String },
                userId: { type: String },
                dateTime: { type: String },
            }
        ],
    },
    subDomain: { 
        type: String,
        unique: true,
    },
    companyFeatures: {
            subscriptionStatus: {
                isActive: { type: Boolean, default: false },
                plan: { type: String, default: '' },
                startDate: { type: Date },
                endDate: { type: Date }
            },
            paymentInfo: {
                paymentMethod: { type: String, default: '' },
                cardLastFour: { type: String, default: '' },
                expirationDate: { type: String, default: '' },
                billingAddress: { type: String, default: '' },
            },
            modules: {
                hr: {
                    type: Boolean,
                    default: false,
                    features: {
                        employeeManagement: { type: Boolean, default: false },
                        leaveManagement: { type: Boolean, default: false },
                        designationManagement: { type: Boolean, default: false },
                        departmentManagement: { type: Boolean, default: false },
                        appraisalManagement: { type: Boolean, default: false },
                        expenseManagement: { type: Boolean, default: false }
                    }
                },
                orderManagement: {
                    type: Boolean,
                    default: false,
                    features: {
                        orderProcessing: { type: Boolean, default: false },
                        inventoryManagement: { type: Boolean, default: false },
                        invoicing: { type: Boolean, default: false },
                        shipping: { type: Boolean, default: false }
                    }
                }
            },
        default: [{
            subscriptionStatus: {
                isActive: false,
                plan: '',
                autoRenew: false,
            },
            paymentInfo: {
                paymentMethod: '',
                cardLastFour: '',
                expirationDate: '',
                billingAddress: '',
            },
            modules: {
                hr: {
                    features: {
                        employeeManagement: false,
                        leaveManagement: false,
                        designationManagement: false,
                        departmentManagement: false,
                        appraisalManagement: false,
                        expenseManagement: false
                    }
                },
                orderManagement: {
                    features: {
                        orderProcessing: false,
                        inventoryManagement: false,
                        invoicing: false,
                        shipping: false
                    }
                }
            }
        }]
    },
})

module.exports = mongoose.model("Company", CompanySchema);
