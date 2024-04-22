
import dotenv from 'dotenv';
import Employee from '../../model/Employees';
import Roles from '../../model/Roles';
import AuditTrail from '../../model/AuditTrail';
import Company from '../../model/Company';
import utils from '../../config/utils';
import { emailTemp } from '../../emailTemplate';
import LeaveRecords from '../../model/LeaveRecords';
import { sendEmail } from '../../config/email';
import daysUsed from '../../cron/daysUsed';
import Holidays from '../../model/Holidays';
import Notification from '../../model/Notification';

const { differenceInDays, addDays, isSaturday, isSunday } = require('date-fns');
// const { parse, format } = require('date-fns-tz');
const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);





function countWeekdays(start, end, holidays) {
    let count = 0;
    let currentDate = new Date(start);
  
    while (currentDate <= end) {
      if (!isSaturday(currentDate) && !isSunday(currentDate) && !isHoliday(currentDate, holidays)) {
        count++;
      }
      currentDate = addDays(currentDate, 1);
    }
  
    return count;
  }
  
  function isHoliday(date, holidays) {
    return holidays.some(holiday => isSameDay(date, new Date(holiday.date)));
  }



const leaveAction = async (req, res) => {

    try {
      
        

        const { leaveId, approved, assignedNoOfDays, decisionMessage, employeeId } = req.body;

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

        const holidays = await Holidays.find({companyId: req.payload.id})

//         let leaveAssignment;

//    Employee.findOne(
//             { _id: leaveType.userId, 'leaveAssignment.leaveTypeId': leaveType.leaveTypeId },
//             { 'leaveAssignment.$': 1 }, // Projection to include only the matched leaveAssignment
//             (err, employee) => {
//               if (err) {
//                 console.error('Error fetching employee:', err);
//               } else {
//                 leaveAssignment = employee.leaveAssignment
//                 console.log('LeaveAssignment with leaveTypeId:', employee.leaveAssignment);
//               }
//             }
//           );



          let leaveAssignment;

const findEmployee = () => {
  return new Promise((resolve, reject) => {
    Employee.findOne(
      { _id: leaveType.userId, 'leaveAssignment.leaveTypeId': leaveType.leaveTypeId },
      { 'leaveAssignment.$': 1 },
      (err, employee) => {
        if (err) {
          reject(err);
        } else {
          resolve(employee);
        }
      }
    );
  });
};

findEmployee()
  .then(async (employee) => {
    leaveAssignment = employee.leaveAssignment;
    console.log('LeaveAssignment with leaveTypeId:', employee.leaveAssignment);
    console.log({ leaveAssignment });





    const dateString = leaveType.leaveStartDate;
    const [day, month, year] = dateString.split('-').map(Number);
    
    // Note: JavaScript months are 0-indexed, so we subtract 1 from the month
    const jsDate = new Date(year, month - 1, day);

    const dateStrings =  leaveType.leaveEndDate;
    const [days, months, years] = dateStrings.split('-').map(Number);
    
    // Note: JavaScript months are 0-indexed, so we subtract 1 from the month
    const jsDates = new Date(years, months - 1, days);

    const startDate = jsDate;
    const endDate = jsDates;

    console.log({startDate})
    console.log({endDate})




    const daysWithoutWeekends = await countWeekdays(startDate, endDate, holidays);

    console.log(leaveAssignment[0].noOfLeaveDays)

    if (daysWithoutWeekends > leaveAssignment[0].noOfLeaveDays) {
        res.status(400).json({
            status: 400,
            error: "Cannot be approved because the number of days assigned has been exceeded"
        });
        return;
    }

    if ((leaveType.daysUsed + daysWithoutWeekends) > leaveAssignment[0].noOfLeaveDays) {
        res.status(400).json({
            status: 400,
            error: "Cannot be approved because the number of days assigned has been exceeded"
        });
        return;
    }

  


    const result = approved
    ? leaveAssignment[0].noOfLeaveDays === undefined
    ? daysWithoutWeekends
    : leaveAssignment[0].noOfLeaveDays - daysWithoutWeekends
    : approved === false && leaveAssignment[0].noOfLeaveDays;

        console.log({result});


    await leaveType.updateOne({
        status: approved == true ? "Approved" : "Declined"
    }).then(async (app) => {
        
        Employee.findOneAndUpdate({ _id: leaveType.userId }, { 
            $set: { 

                "leaveAssignment.$[i].leaveApproved": approved && approved,
                "leaveAssignment.$[i].status": approved == true ? "Approved" : approved == false && "Declined",
                "leaveAssignment.$[i].leaveStartDate": leaveType.leaveStartDate && leaveType.leaveStartDate,
                "leaveAssignment.$[i].leaveEndDate": leaveType.leaveEndDate && leaveType.leaveEndDate,
                "leaveAssignment.$[i].assignedNoOfDays": leaveType.assignedNoOfDays && leaveType.assignedNoOfDays,
                "leaveAssignment.$[i].decisionMessage": decisionMessage && decisionMessage,
                "leaveAssignment.$[i].daysUsed": approved  ? daysWithoutWeekends : approved == false && leaveType.daysUsed,
                "leaveAssignment.$[i].daysLeft": result

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


                   LeaveRecords.findOneAndUpdate({ _id: leaveId }, { 
                        $set: { 
                           decisionMessage: decisionMessage,
                           daysLeft: approved
                           ? leaveAssignment[0].noOfLeaveDays === undefined
                           ? daysWithoutWeekends
                           : leaveAssignment[0].noOfLeaveDays - daysWithoutWeekends
                           : approved === false && leaveAssignment[0].noOfLeaveDays,
                           daysUsed: approved  ? daysWithoutWeekends : approved == false && leaveType.daysUsed
        
                        }
                   },
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
                                Hi ${check.firstName},
                                </p> 
                        
                                <p style="font-size: 16px; text-align: left !important; font-weight: 300;">
                                
                                 Your leave request has been ${approved == true ? "Approved" : "Declined"}
                               
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

                                let notification = new Notification({
                                  created_by: req.payload.id,
                                  companyName: check.companyName,
                                  companyId: check.companyId,
                                  recipientId: check._id,
                                  notificationType: `Leave Application`,
                                  notificationContent: ` Your leave request has been ${approved == true ? "Approved" : "Declined"}`
                              })
                              await notification.save();
            
                                res.status(200).json({
                                    status: 200,
                                    success: true,
                                    data: "Update Successful"
                                })
                               return
                            }
                        })
                   
                }
            })
     

    });
  })
  .catch((err) => {
    console.error('Error fetching employee:', err);
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



