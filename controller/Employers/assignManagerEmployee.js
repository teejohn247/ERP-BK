
import dotenv from 'dotenv';
import Employee from '../../model/Employees';
import Roles from '../../model/Roles';
import AuditTrail from '../../model/AuditTrail';
import Company from '../../model/Company';
import utils from '../../config/utils';
import { emailTemp } from '../../emailTemplate';

import Designation from "../../model/Designation";
import Department from "../../model/Department";

const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const assignManagerEmployee = async (req, res) => {

    try {
   
        // const { firstName, lastName, dateOfBirth, departmentId , companyRole, designationId, phoneNumber, gender,
        // employmentType} = req.body;

        const { employees, managerId } = req.body;
        

        const check = await Employee.findOne({ _id: managerId });
        let company = await Company.findOne({ _id: req.payload.id });

        if (!company) {
            res.status(400).json({
                status: 400,
                error: "Company doesn't exist"
            });
            return;
        }

        if (check.companyId !== company._id.toString()) {
            res.status(400).json({
                status: 400,
                error: "Manager does not belong to this company"
            });
            return;
        }

        console.log({employees});

      
        const approval = [{
            approvalType: 'leave',
            approval: `${check.firstName} ${check.lastName}`,
            approvalId: managerId
        },
        {
            approvalType: 'reimbursement',
            approval: `${check.firstName} ${check.lastName}`,
            approvalId: managerId
        }]

        // let checks_sch = await School.find({ _id: { $in : ids }},
        //     { notification_types: { $elemMatch: { notification_id: notificationId } } })
            
        Employee.updateMany({ _id: { $in : employees }}, { 
            $set: { 
                managerId:  managerId,
                managerName: check && `${check.firstName} ${check.lastName}`,
                approvals: approval
            }
       },{ upsert: true },
            async function (
                err,
                result
            ) {
                if (err) {
                    res.status(401).json({
                        status: 401,
                        success: false,
                        error: err

                    })

                    return;

                } else {


                    Employee.updateOne({ _id: managerId }, { 
                        $set: { 
                            isManager: true
                        }
                   },{ upsert: true },
                        async function (
                            err,
                            result
                        ) {
                            if (err) {
                                res.status(401).json({
                                    status: 401,
                                    success: false,
                                    error: err
            
                                })
            
                                return;
            
                            } else {
            
                                // await check.updateOne({
                                //     paymentInformation: paymentInformation && paymentInformation, 
                                // });
                                // const checkUpdated = Employee.findOne({ _id: req.params.id })
                                // AuditTrail.findOneAndUpdate({ companyId: company[0]._id},
                                //     { $push: { humanResources: { 
                    
                                //         userName: checkUpdated.firstName && checkUpdated.lastName,
                                //         email: checkUpdated.email && checkUpdated.email,
                                //         action: `Super admin updated ${checkUpdated.firstName} ${checkUpdated.lastName} records`,
                                //         dateTime: new Date()
            
                                //      }}
                                //    },
                                //         function (
                                //             err,
                                //             result
                                //         ) {
                                //             if (err) {
                                //                 res.status(401).json({
                                //                     status: 401,
                                //                     success: false,
                                //                     error: err
                            
                                //                 })
                                //                 return;
                            
                                //             } else {
                            
                            
                                                // res.status(200).json({
                                                //     status: 200,
                                                //     success: true,
                                                //     data: "Update Successful"
                                                // })
                                                // return;
                            
                                //             }
                                //         })
            
                                res.status(200).json({
                                    status: 200,
                                    success: true,
                                    data: "Update Successful"
                                })
                                return;
                            }
                        })

                    // await check.updateOne({
                    //     paymentInformation: paymentInformation && paymentInformation, 
                    // });
                    // const checkUpdated = Employee.findOne({ _id: req.params.id })
                    // AuditTrail.findOneAndUpdate({ companyId: company[0]._id},
                    //     { $push: { humanResources: { 
        
                    //         userName: checkUpdated.firstName && checkUpdated.lastName,
                    //         email: checkUpdated.email && checkUpdated.email,
                    //         action: `Super admin updated ${checkUpdated.firstName} ${checkUpdated.lastName} records`,
                    //         dateTime: new Date()

                    //      }}
                    //    },
                    //         function (
                    //             err,
                    //             result
                    //         ) {
                    //             if (err) {
                    //                 res.status(401).json({
                    //                     status: 401,
                    //                     success: false,
                    //                     error: err
                
                    //                 })
                    //                 return;
                
                    //             } else {
                
                
                                    // res.status(200).json({
                                    //     status: 200,
                                    //     success: true,
                                    //     data: "Update Successful"
                                    // })
                                    // return;
                
                    //             }
                    //         })

                    // res.status(200).json({
                    //     status: 200,
                    //     success: true,
                    //     data: "Update Successful"
                    // })
                    // return;
                }
            })



    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })

        return;

    }
}
export default assignManagerEmployee;



