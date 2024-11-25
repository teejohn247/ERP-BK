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
    dateCreated: { type: Date, default: Date.now },
    industry: { type: String },
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
                currentCycle: { type: String },
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

                
                HumanResources: {
                 id: {type: Number},
                 active: {type: Boolean, default: false},
                  employeeManagement: {
                    id: {type: Number},
                    permissions: {
                        type: Object,
                        default: {}
                    }
                  },
                  leaveManagement: {
                    id: {type: Number},
                    permissions: {
                        type: Object,
                        default: {}
                    }
                  },
                  appraisalManagement: {
                    id: {type: Number},
                    permissions: {
                        type: Object,
                        default: {}
                    }
                  },
                  expenseManagement: {
                    id: {type: Number},
                    permissions: {
                        type: Object,
                        default: {}
                    }
                  },
                  payrollManagement: {
                    id: {type: Number},
                    permissions: {
                        type: Object,
                        default: {}
                    }
                  },
                  settingsManagement: {
                    id: {type: Number},
                    permissions: {
                        type: Object,
                        default: {}
                    }
                  },
                  calenderManagement: {
                    id: {type: Number},
                    permissions: {
                        type: Object,
                        default: {}
                    }
                  }
                },
                OrderManagement: {
                 id: {type: Number},
                 active: {type: Boolean, default: false},
                  orderProcessing: {
                    id: {type: Number},     
                    permissions: {
                        type: Object,
                        default: {}
                    }
                  },
                  invoicing: {
                    id: {type: Number},
                    permissions:{
                        type: Object,
                        default: {}
                    }
                  },
                  shipping: {
                    id: {type: Number},
                    permissions: {
                        type: Object,
                        default: {}
                    }
                  }
                }
              }
    },
})

module.exports = mongoose.model("Company", CompanySchema);
