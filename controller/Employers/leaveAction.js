
import dotenv from 'dotenv';
import Employee from '../../model/Employees';
import Roles from '../../model/Roles';
import AuditTrail from '../../model/AuditTrail';
import Company from '../../model/Company';
import utils from '../../config/utils';
import { emailTemp } from '../../emailTemplate';
import LeaveRecords from '../../model/LeaveRecords';
import { sendEmail } from '../../config/email';

const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const leaveAction = async (req, res) => {

    try {
      

        const { leaveId, approved, employeeId } = req.body;

        let company = await Company.findOne({ _id: req.payload.id });
        const leaveType = await LeaveRecords.findOne({ _id: leaveId});
        const check = await Employee.findOne({ _id: leaveType.userId});



        if (!check) {
            res.status(400).json({
                status: 400,
                error: "Employee doesn't exist"
            });
            return;
        }

        if (!leaveType) {
            res.status(400).json({
                status: 400,
                error: "leaveType doesn't exist"
            });
            return;
        }

        console.log(leaveType.userId)

        await leaveType.updateOne({
            approved
        }).then(async (app) => {


            Employee.findOneAndUpdate({ _id: leaveType.userId }, { 
                $set: { 
                    "leaveAssignment.$[i].leaveApproved": approved && approved,
                    "leaveAssignment.$[i].leaveStartDate": leaveType.leaveStartDate && leaveType.leaveStartDate,
                    "leaveAssignment.$[i].leaveEndDate": leaveType.leaveEndDate && leaveType.leaveEndDate,

                }
           },
           { 
            arrayFilters: [
                {
                    "i.leaveTypeId": leaveType.leaveTypeId
                }
            ]},
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
    
                    } else {
                        let data = `<div>
                        <p style="padding: 32px 0; text-align: left !important; font-weight: 700; font-size: 20px;font-family: 'DM Sans';">
                        Hi ${check.fullName},
                        </p> 
                
                        <p style="font-size: 16px; text-align: left !important; font-weight: 300;">
                        
                         Your leave request has been ${approved == true ? 'approved' : 'declined'}
                       
                        <br><br>
                        </p>
                        
                        <div>`
                
                       let resp = emailTemp(data, 'Leave Application Notification')
            
            
                       const receivers = [
                        {
                          email: check.email
                        }
                      ]
                
                        await sendEmail(req, res, check.email, receivers, 'Leave Application Notification', resp);
    
                        res.status(200).json({
                            status: 200,
                            success: true,
                            data: "Update Successful"
                        })
                       return
                    }
                })
         

        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })

        return;

    }
}
export default leaveAction;



