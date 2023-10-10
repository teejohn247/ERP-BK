import { string } from 'joi';
import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    companyId:{ type: String, required: true },
    activeStatus: { type: Boolean, default: false},
    password: { type: String},
    firstTimeLogin: { type: Boolean },
    // personalInformation:[{
    //     firstName: { type: String, required: true },
    //     lastName: { type: String, required: true },
    //     dateOfBirth: { type: String, required: true },
    //     personalEmail: { type: String },
    //     phoneNumber: { type: String, required: true },
    //     profilePic: { type: String },
    //     address: { type: String },
    //     gender: { type: String, required: true, trim: true },
    //     nextOfKinFullName: {
    //         type: String,
    //     },
    //     nextOfKinAddress: {
    //         type: String,
    //     },
    //     nextOfKinPhoneNumber: {
    //         type: String,
    //     },
    //     nextOfKinGender: {
    //         type: String,
    //     },

    //  }],
        firstName: { type: String, required: true , trim: true },
        lastName: { type: String, required: true, trim: true  },
        fullName: { type: String, trim: true  },
        dateOfBirth: { type: String, trim: true  },
        personalEmail: { type: String },
        phoneNumber: { type: String,  trim: true  },
        profilePic: { type: String, default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKoUT6kaiW2c9qcsxtXXDLJWsHwDvTNgaIkSzH7d0mNg&s" },
        address: { type: String, trim: true  },
        gender: { type: String, trim: true },
        nextOfKinFullName: {
            type: String,
            trim: true 
        },
        nextOfKinAddress: {
            type: String,
            trim: true 
        },
        nextOfKinPhoneNumber: {
            type: String,
            trim: true 
        },
        nextOfKinGender: {
            type: String,
            trim: true 
        },
        email: { type: String, required: true, unique: true , trim: true },
        department: { type: String, required: true, trim: true },
        employmentType: { type: String, required: true,trim: true  },
        employeeCode: { type: String, required: true, trim: true  },
        companyAddress: { type: String, trim: true  },
        companyBranch: { type: String, trim: true  },
        position: { type: String, trim: true  },
        role: { type: String , trim: true },
        designation: {
            type: String,
          },
        designationId: {
            type: String,
          },
        designationName: { type: String, trim: true  },
        roleName: { type: String, trim: true },
        employmentStartDate: { type: String, trim: true  },
        managerId: { type: String , trim: true },
        managerName: { type: String,trim: true  },
        companyRole: { type: String,trim: true  },
        approvals: [
            {
                approvalType: {
                    type: String,
                },
                approval: {
                    type: String
                },
                approvalId: {
                    type: String
                },
            }
        ],
        roles:{
         humanResources: [
            {
                role_id: {
                    type: String,
                },
                role_name: {
                    type: String
                },
                date_assigned: {
                    type: Date
                }
            }
        ],
        accounting: [
            {
                role_id: {
                    type: String,
                },
                role_name: {
                    type: String
                },
                date_assigned: {
                    type: Date
                }
            }
        ],
        projects: [
            {
                role_id: {
                    type: String,
                },
                role_name: {
                    type: String
                },
                date_assigned: {
                    type: Date
                }
            }
        ],
        crm: [
            {
                role_id: {
                    type: String,
                },
                role_name: {
                    type: String
                },
                date_assigned: {
                    type: Date
                }
            }
        ],
        supplyChain: [
            {
                role_id: {
                    type: String,
                },
                role_name: {
                    type: String
                },
                date_assigned: {
                    type: Date
                }
            }
        ],
     
    },
    expenseDetails: 
    {
        expenseTypeId: {
            type: String,
        },
        cardNo: {
            type: String,
        },
        cardHolder: {
            type: String,
        },
        dateIssued: {
            type: String,
        },
        expiryDate: {
            type: String,
            default: ""
        },
        cardLimit: {
            type: Number,
            default: 0

        },
        cardBalance: {
            type: Number,
            default: 0
        },
        totalSpent: {
            type: Number,
            default: 0

        },
        currentSpent: {
            type: Number,
            default: 0

        },
        currentExpense: {
            type: Number,
            default: 0

        },
        expenseHistory: [{
            expenseTypeId: { type: String, required: true },
            expenseTypeName: { type: String, required: true },
            expenseDate: { type: String, required: true },
            currency: { type: String },
            amount: { type: String, required: true },
            attachment: { type: String },
            approver: { type: String },
            approverId: { type: String },
            dateRemitted: { type: String, default: Date.now() },
            description: { type: String }
        }]
    },
    leaveAssignment: 
    [{
        leaveTypeId: {
            type: String,
        },
        leaveName: {
            type: String,
        },
        noOfLeaveDays: {
            type: Number,
        },
        description: {
            type: String,
        },
        assignedNoOfDays: {
            type: Number,
        },
        daysUsed: {
            type: Number,
            default: 0
        },
        leaveStartDate: {
            type: String,
        },
        leaveEndDate: {
            type: String,
        },
        comments:{
            type: String,
        },
        leaveApproved:{
            type: Boolean,
            default: false
        }
    }],
    officialInformation:[{
        // leave: [{
        //     leaveName: {
        //         type: String,
        //     },
        //     noOfDays: {
        //         type: String,
        //     },
        //     paid: {
        //         type:Boolean,
        //     },
        //     leaveType: {
        //         type: String,
        //     },
        //     leaveStart: {
        //         type: String,
        //     },
        //     leaveEndDate: {
        //         type: String,
        //     },
        //     daysUsed: {
        //         type: String,
        //     },
        //     leaveApproved: {
        //         type: Boolean,
        //     }
        // }],
        // leave:
        // [{
        //     leaveTypeId: {
        //         type: String,
        //     },
            // leaveType: {
            //     type: String,
            // },
            // leaveStart: {
            //     type: String,
            // },
            // leaveEndDate: {
            //     type: String,
            // },
            // daysUsed: {
            //     type: String,
            // },
            // leaveApproved: {
            //     type: Boolean,
            //     default: false
            // },
            // leaveAttendedTo: {
            //     type: Boolean,
            //     default: false
            // }
        // }],
        hmo:
        [{
            hmoName: {
                type: String,
            },
            features: {
                type: Array,
            },
            description: {
                type: String,
            }
        }],

    }],
  
    paymentInformation:[{
        bankName: {
            type: String,
        },
        bankAddress: {
            type: String,
        },
        accountNumber: {
            type: String,
        },
        accountName: {
            type: String,
        },
        sortCode: {
            type: String,
        },
        TaxIndentificationNumber: {
            type: String,
        },
    }],

    // attendance:
    //     [{
    //         attendanceDate: {
    //             type: Date,
    //         },
    //         attendanceClockIn: {
    //             type: String,
    //         },
    //         attendanceClockOut: {
    //             type: String,
    //         },
    //         workHours: {
    //             type: String,
    //         },
    //     }],
    // salaryHistory:
    //     [{
    //         salaryMonth: {
    //             type: String,
    //         },
    //         amount: {
    //             type: Number,
    //         },
    //         tax: {
    //             type: Number,
    //         },
    //         deductables: {
    //             type: Number,
    //         },
    //         totalTakeHome: {
    //             type: Number,
    //         },
    //         salaryDate: {
    //             type: Date
    //         },
    //         bankName: {
    //             type: String,
    //         },
    //         acctNumber: {
    //             type: String,
    //         },
    //         acctName: {
    //             type: String,
    //         },
    //         sortCode: {
    //             type: String,
    //         },
    //     }],
    isManager:{
        type: Boolean,
        default: false
    },
    isSuperAdmin: {
        type: Boolean,
        default: false
    },

})

module.exports = mongoose.model("Employee", EmployeeSchema);