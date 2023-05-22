// import mongoose from 'mongoose';

// import PermissionsSchema from './Permissions'

// const RolesSchema = new mongoose.Schema({

//             role_name: {type: String, required: true},
//             permissions: {
//             school: 
//             {
//                 add_school: {
//                      type: Boolean,
//                      default: false
//                  },
//                  edit_school: {
//                      type: Boolean,
//                      default: false
//                  },
//                  deactivate_school: {
//                      type: Boolean,
//                      default: false
//                  },
//                  view_all_schools: {
//                      type: Boolean,
//                      default: false
//                  }
//              },
//              class_creation: {
//                  assign_class_creation: {
//                       type: Boolean,
//                       default: false
//                   },
//                   deactivate_class_assigning: {
//                       type: Boolean,
//                       default: false
//                   }
//               },
//               notification: {
//                  create_notification_type: {
//                       type: Boolean,
//                       default: false
//                   },
//                   assign_notification: {
//                       type: Boolean,
//                       default: false
//                   },
//                   view_notification: {
//                      type: Boolean,
//                      default: false
//                  },
//                   edit_notification: {
//                      type: Boolean,
//                      default: false
//                  },
//                  deactivate_notification: {
//                      type: Boolean,
//                      default: false
//                  }
//               },
//               calender: {
//                  view_calender: {
//                       type: Boolean,
//                       default: false
//                   },
//                   assign_calender_schools: {
//                       type: Boolean,
//                       default: false
//                   },
//                   deactivate_calender: {
//                      type: Boolean,
//                      default: false
//                  }
//               },
//               user_management: {
//                  create_user: {
//                       type: Boolean,
//                       default: false
//                   },
//                   deactivate_user: {
//                       type: Boolean,
//                       default: false
//                   },
//                   view_users: {
//                      type: Boolean,
//                      default: false
//                  }
//               },
//               expansion: {
//                  expand_school: {
//                       type: Boolean,
//                       default: false
//                   },
//                   view_schools_and_school_branches: {
//                       type: Boolean,
//                       default: false
//                   },
//                   assign_expansion_funtionality: {
//                      type: Boolean,
//                      default: false
//                  }
//               },
//               forms: {
//                  edit_forms: {
//                       type: Boolean,
//                       default: false
//                   },
//                   assign_forms: {
//                       type: Boolean,
//                       default: false
//                   },
//                   deactivate_form_settings: {
//                      type: Boolean,
//                      default: false
//                  }
//               },
//              data_onboarding: {
//                  view_data_onboarding_forms: {
//                       type: Boolean,
//                       default: false
//                   },
//                   create_data_onboarding_forms: {
//                       type: Boolean,
//                       default: false
//                   },
//                   deactivate_data_onboarding_forms: {
//                      type: Boolean,
//                      default: false
//                  },
//                  assign_forms: {
//                      type: Boolean,
//                      default: false
//                  }
//               },
//               academics: {
//                 create_user: {
//                       type: Boolean,
//                       default: false
//                   },
//                   deactivate_user: {
//                       type: Boolean,
//                       default: false
//                   },
//                   view_users: {
//                      type: Boolean,
//                      default: false
//                  }
//               }
//             },

//             assigned_to:  [{
//                 admin_id: {
//                     type: String,
//                 },
//                 admin_name: {
//                     type: String
//                 },
//                 date_assigned: {
//                     type: Date
//                 }
//             }],
//             enabled: {
//                 type: Boolean,
//                 default: true
//             },
 
//         },
//     { timestamps: true })


// module.exports = mongoose.model("Roles", RolesSchema);


