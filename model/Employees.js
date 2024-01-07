import { string } from "joi";
import mongoose from "mongoose";
import moment from "moment";

const EmployeeSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  companyId: { type: String, required: true },
  activeStatus: { type: Boolean, default: false },
  password: { type: String },
  firstTimeLogin: { type: Boolean },
  roles: {
    employeeManagement: {
      role_id: {
        type: String,
      },
      role_name: {
        type: String,
      },
      date_assigned: {
        type: Date,
      },
    },

    accounting: {
      role_id: {
        type: String,
      },
      role_name: {
        type: String,
      },
      date_assigned: {
        type: Date,
      },
    },  
    projects: {
      role_id: {
        type: String,
      },
      role_name: {
        type: String,
      },
      date_assigned: {
        type: Date,
      },
    },
    crm: {
      role_id: {
        type: String,
      },
      role_name: {
        type: String,
      },
      date_assigned: {
        type: Date,
      },
    },
    supplyChain: {
      role_id: {
        type: String,
      },
      role_name: {
        type: String,
      },
      date_assigned: {
        type: Date,
      },
    },
  },

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
  email: { type: String, required: true, unique: true, trim: true },

  nationality: { type: String, trim: true },
    country: { type: String,  trim: true },
    city: { type: String, trim: true },
  departmentId: { type: String,  trim: true },
  department: { type: String, required: true, trim: true },
  employmentType: { type: String, required: true, trim: true },
  employeeCode: { type: String, required: true, trim: true },
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
  assignedAppraisals:[
    {
        appraisalId: { type: String, required: true },
        appraisalName: { type: String, required: true },
        dateAssigned: {
            type: Date,
            default: new Date().toISOString() 
        }

    }
],
  approvals: [
    {
      approvalType: {
        type: String,
      },
      approval: {
        type: String,
      },
      approvalId: {
        type: String,
      },
    },
  ],

  permissions: { type: mongoose.Schema.Types.Mixed, ref: "Permissions" },
  expenseDetails: {
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
      default: "",
    },
    cardLimit: {
      type: Number,
      default: 0,
    },
    cardBalance: {
      type: Number,
      default: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
    currentSpent: {
      type: Number,
      default: 0,
    },
    currentExpense: {
      type: Number,
      default: 0,
    },
 
    expenseHistory: [
      {
        expenseTypeId: { type: String, required: true },
        expenseTypeName: { type: String, required: true },
        expenseDate: { type: String, required: true },
        currency: { type: String },
        amount: { type: String, required: true },
        attachment: { type: String },
        approver: { type: String },
        approverId: { type: String },
        dateRemitted: { type: String },
        dateOfApproval: { type: String },
        description: { type: String },
        dateRequested: { type: Date, default: Date.now() },
      },
    ],
  },
  leaveAssignment: [
    {
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
        default: 0,
      },
      leaveStartDate: {
        type: String,
      },
      leaveEndDate: {
        type: String,
      },
      requestMessage: {
        type: String,
      },
      decisionMessage: {
        type: String,
      },
      leaveApproved: {
        type: Boolean,
        default: false,
      },
    },
  ],
  officialInformation: [
    {
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
      hmo: [
        {
          hmoName: {
            type: String,
          },
          features: {
            type: Array,
          },
          description: {
            type: String,
          },
        },
      ],
    },
  ],

  paymentInformation: {
    type: [
      {
        bankName: {
          type: String,
          default: ""
        },
        bankAddress: {
          type: String,
          default: ""
        },
        accountNumber: {
          type: Number,
          default: 0
        },
        accountName: {
          type: String,
          default: ""
        },
        sortCode: {
          type: String,
          default: ""
        },
        taxIdentificationNumber: {
          type: String,
          default: ""
        },
      },
    ],
    default: [{}] // Initialize with an empty object as default
  },

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
  isManager: {
    type: Boolean,
    default: false,
  },
  isSuperAdmin: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Employee", EmployeeSchema);
