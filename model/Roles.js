import mongoose from 'mongoose';

// import PermissionsSchema from './Permissions'

const RolesSchema = new mongoose.Schema({

            role_name: {type: String, required: true},
            permissions: {
            employeeManagement: 
            [{
                views:{
                view_employee: {
                     type: Boolean,
                     default: false
                 },
                 view_payment_information: {
                     type: Boolean,
                     default: false
                 },
                 view_leave_details: {
                     type: Boolean,
                     default: false
                 },
                 view_employee_ladder: {
                     type: Boolean,
                     default: false
                 }
                },

                actions:{
                    add_employee: {
                         type: Boolean,
                         default: false
                     },
                     edit_employee: {
                         type: Boolean,
                         default: false
                     },
                     delete_employee: {
                         type: Boolean,
                         default: false
                     },
                    },
             }],
             recruitment: 
             [{
                 views:{
                 view_recruitment_history: {
                      type: Boolean,
                      default: false
                  },
                  view_recruitment_overview: {
                      type: Boolean,
                      default: false
                  },
                  view_job_listings: {
                      type: Boolean,
                      default: false
                  },
                  view_employee_ladder: {
                      type: Boolean,
                      default: false
                  },
                  view_job_applicants: {
                    type: Boolean,
                    default: false
                },
                 },
 
                 actions:{
                     publish_job_listing: {
                          type: Boolean,
                          default: false
                      },
                      edit_job_listing: {
                          type: Boolean,
                          default: false
                      },
                      delete_job_listing: {
                          type: Boolean,
                          default: false
                      },
                     },
              }],
             
            }
        }, { timestamps: true });


module.exports = mongoose.model("Roles", RolesSchema);


