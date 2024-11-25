import mongoose from 'mongoose';

// Define permission schema for dynamic permissions
// const PermissionSchema = new mongoose.Schema({
//   type: Map,
//   of: Boolean,
//   default: new Map()
// }, { _id: false });


const ModulesSchema = new mongoose.Schema({
  modules: {
    HumanResources: {
     id: {type: Number},
      employeeManagement: {
        id: {type: Number},
        permissions: {
            type: Map,
            of: mongoose.Schema.Types.Mixed,
        }
      },
      leaveManagement: {
        id: {type: Number},
        permissions: {
            type: Map,
            of: mongoose.Schema.Types.Mixed,
        }
      },
      appraisalManagement: {
        id: {type: Number},
        permissions: {
            type: Map,
            of: mongoose.Schema.Types.Mixed,
        }
      },
      expenseManagement: {
        id: {type: Number},
        permissions: {
            type: Map,
            of: mongoose.Schema.Types.Mixed,
        }
      },
      payrollManagement: {
        id: {type: Number},
        permissions: {
            type: Map,
            of: mongoose.Schema.Types.Mixed,
        }
      },
      settingsManagement: {
        id: {type: Number},
        permissions: {
            type: Map,
            of: mongoose.Schema.Types.Mixed,
        }
      },
      calenderManagement: {
        id: {type: Number},
        permissions: {
            type: Map,
            of: mongoose.Schema.Types.Mixed,
        }
      }
    },
    OrderManagement: {
     id: {type: Number},
      orderProcessing: {
        id: {type: Number},     
        permissions: {
            type: Map,
            of: mongoose.Schema.Types.Mixed,
        }
      },
      invoicing: {
        id: {type: Number},
        permissions:{
            type: Map,
            of: mongoose.Schema.Types.Mixed,
        }
      },
      shipping: {
        id: {type: Number},
        permissions: {
            type: Map,
            of: mongoose.Schema.Types.Mixed,
        }
      }
    }
  }
}, { timestamps: true });

module.exports = mongoose.model("Modules", ModulesSchema);
