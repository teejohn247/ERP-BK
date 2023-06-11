import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    companyId:{ type: String, required: true },
    personalInformation:[{
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        dateOfBirth: { type: String, required: true },
        personalEmail: { type: String },
        phoneNumber: { type: String, required: true },
        profilePic: { type: String },
        address: { type: String },
        gender: { type: String, required: true, trim: true },
        nextOfKinFullName: {
            type: String,
        },
        nextOfKinAddress: {
            type: String,
        },
        nextOfKinPhoneNumber: {
            type: String,
        },
        nextOfKinGender: {
            type: String,
        },

     }],
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
    officialInformation:[{
        officialEmail: { type: String, required: true },
        departmentId: { type: String, required: true},
        departmentName: { type: String, required: true},
        employmentType: { type: String, required: true },
        employeeCode: { type: String, required: true },
        companyAddress: { type: String },
        companyBranch: { type: String },
        position: { type: String },
        role: { type: String },
        designationId: { type: String },
        designationName: { type: String },
        roleName: { type: String },
        dateOfJoining: { type: String },
        reportingToId: { type: String },
        reportingToName: { type: String },

        leave: [{
            leaveName: {
                type: String,
            },
            noOfDays: {
                type: String,
            },
            paid: {
                type:Boolean,
            },
            leaveType: {
                type: String,
            },
            leaveStart: {
                type: String,
            },
            leaveEndDate: {
                type: String,
            },
            daysUsed: {
                type: String,
            },
            leaveApproved: {
                type: Boolean,
            }
        }],
        // leave:
        // [{
        //     leaveId: {
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

})

module.exports = mongoose.model("Employee", EmployeeSchema);