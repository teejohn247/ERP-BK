
import dotenv from 'dotenv';
import Employee from '../../model/Employees';
import Roles from '../../model/Roles';
import AuditTrail from '../../model/AuditTrail';
import Company from '../../model/Company';
import utils from '../../config/utils';
import { emailTemp } from '../../emailTemplate';

import Designation from "../../model/Designation";
import Department from "../../model/Department";
import LeaveRecords from '../../model/LeaveRecords';
import Leave from '../../model/Leaves'
import { sendEmail } from '../../config/email';

const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const leaveApplication = async (req, res) => {

    try {
      

        const { leaveTypeId, leaveStartDate, leaveEndDate, requestMessage, noOfLeaveDays } = req.body;

        console.log(req.payload.id)

        const check = await Employee.findOne({ _id: req.payload.id });

        console.log({check})

        if (!check) {
            res.status(400).json({
                status: 400,
                error: "Only employee can request for leave"
            });
            return;
        }

        if (!check.managerId) {
            res.status(400).json({
                status: 400,
                error: "Manager has not been assigned to employee"
            });
            return;
        }
        const checkManager = await Employee.findOne({ _id: check.managerId});


        if(checkManager)

        console.log({checkManager})

        if (!checkManager) {
            res.status(400).json({
                status: 400,
                error: "Employee has not been assigned manager"
            });
            return;
        }
        if (!check) {
            res.status(400).json({
                status: 400,
                error: "Employee doesn't exist"
            });
            return;
        }
        const leaveType = await Leave.findOne({ _id: leaveTypeId });
        let company = await Company.findOne({ _id: check.companyId});

     
        console.log({company})
       

        if (!company) {
            res.status(400).json({
                status: 400,
                error: "Employee not registered under a company"
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

        const approve = check.approvals.filter(obj => obj.approvalType === "leave");

        console.log({approve});



        const exists = check.leaveAssignment.some(obj => obj.leaveTypeId === leaveTypeId);

        if (!exists) {
        res.status(400).json({
            status: 400,
            error: "Leave doesn't exist under user profile"
        });
        return;
        }

        if (!approve && check.managerId) {
            res.status(400).json({
                status: 400,
                error: "You have not been assigned a manager yet"
            });
            return;
            }

        if (!leaveStartDate) {
            res.status(400).json({
                status: 400,
                error: "leaveStartDate is required"
            });
            return;
        }

        if (!leaveEndDate) {
            res.status(400).json({
                status: 400,
                error: "leaveEndDate is required"
            });
            return;
        }
       console.log(approve[0].approvalId, approve[0].approval)
       
        let leave = new LeaveRecords({
                userId:req.payload.id,
                companyName: check.companyName,
                companyId: check.companyId,
                fullName:`${check.firstName} ${check.lastName}`,
                employeeImage:`${check.profilePic}`,
                fullName:`${check.firstName} ${check.lastName}`,
                leaveTypeId,
                leaveTypeName: leaveType.leaveName,
                leaveStartDate,
                leaveEndDate,
                leaveApprover: approve[0].approvalId  ? approve[0].approvalId : check.managerId,
                approver: approve[0].approval ? approve[0].approval : check.managerName,
                companyRole: check.companyRole && check.companyRole,
                department: check.department && check.department,
                requestMessage: requestMessage && requestMessage,
                decisionMessage: ""

        })

        let details;
        await leave.save().then(async(adm) => {

            console.log({adm})

            details = adm


            let data = `<div>
            <p style="padding: 32px 0; text-align: left !important; font-weight: 700; font-size: 20px;font-family: 'DM Sans';">
            Hi,
            </p> 
    
            <p style="font-size: 16px; text-align: left !important; font-weight: 300;">

             ${adm.firstName ? adm.firstName : adm.fullName} has made a leave request. 
             Log in to your account to accept or reject.
           
            <br><br>
            </p>
            
            <div>`
    
           let resp = emailTemp(data, 'Leave Application Notification')
           console.log('heeheh1')


           const receivers = [
            {
              email: checkManager.email
            }
          ]
          console.log('heeheh')
    
            await sendEmail(req, res, checkManager.email, receivers, 'Leave Application Notification', resp);

            let employeeData = `<div>
            <p style="padding: 32px 0; text-align: left !important; font-weight: 700; font-size: 20px;font-family: 'DM Sans';">
            Hi,
            </p> 
    
            <p style="font-size: 16px; text-align: left !important; font-weight: 300;">

             Your leave approver has received your leave request. 
             A decision would be made soon.
           
            <br><br>
            </p>
            
            <div>`
    
           let respEmployee = emailTemp( employeeData, 'Leave Application Notification')
           console.log('heeheh2')

           const receiverEmployee = [
            {
              email: check.email
            }
          ]
          console.log('heeheh')
    
            await sendEmail(req, res, check.email, receiverEmployee, 'Leave Application Notification', respEmployee);

        })

        Employee.findOneAndUpdate({ _id: req.payload.id}, { 
            $set: { 
                "leaveAssignment.$[i].noOfLeaveDays": noOfLeaveDays && noOfLeaveDays,
                "leaveAssignment.$[i].requestMessage": requestMessage && requestMessage,
                "leaveAssignment.$[i].decisionMessage": "",
                "leaveAssignment.$[i].leaveStartDate": leaveStartDate && leaveStartDate,
                "leaveAssignment.$[i].leaveEndDate": leaveEndDate && leaveEndDate
            }
       },
       { 
        arrayFilters: [
            {
                "i._id": leaveTypeId
            }
        ]},
            function (
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


                    res.status(200).json({
                        status: 200,
                        success: true,
                        data: details
                    })

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
export default leaveApplication;



