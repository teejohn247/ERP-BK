
import dotenv from 'dotenv';
import Role from '../../model/Role';
import Company from '../../model/Company';
import Leave from '../../model/Expense';
import AppraisalGroup from '../../model/Rating';
import Attendance from '../../model/StaffAttendance';
import Employee from '../../model/Employees';


const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);


const checkInOut = async (req, res) => {

    try {
 

        let company = await Company.findOne({ _id: req.payload.id });
        // let emp = await Visitor.findOne({ _id: req.params.id});
        // // console.log({appraisal})
        // if (!emp) {
        //     res.status(400).json({
        //         status: 400,
        //         error: 'Visitor does not exist'
        //     })
        //     return;
        // }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let emp = await Employee.findOne({ _id: req.payload.id });
        const att = await Attendance.findOne({
            employeeId: req.payload.id, // Assuming req.payload.id is the user ID
            createdAt: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) } // Find documents created today
          });

          console.log({att})


    if (!emp) {
        return res.status(400).json({
            status: 400,
            error: 'Employee does not exist'
        });
    }

    console.log({emp})
    let currentTime = new Date();
    let lastCheckIn = att.checkIn;
    let lastCheckOut = att.checkOut;

    let updateQuery = {};

    // Get the date portion of the last check-in or check-out time
    const lastCheckInDate = new Date(lastCheckIn).toLocaleDateString();
    const currentDate = currentTime.toLocaleDateString();

    console.log(lastCheckInDate !== currentDate, lastCheckInDate,currentDate)

    if (!lastCheckInDate) {

    

        console.log('here')

   
        Attendance.findOneAndUpdate({ employeeId: att.employeeId }, { checkIn: currentTime,
            attendanceStatus: true}, { new: true }, async function (err, result) {
            if (err) {
                return res.status(401).json({
                    status: 401,
                    success: false,
                    error: err
                });
            } else {
                const att2 = await Attendance.findOne({
                    employeeId: req.payload.id, // Assuming req.payload.id is the user ID
                    createdAt: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) } // Find documents created today
                  });
                return res.status(200).json({
                    status: 200,
                    success: true,
                    data: att2
                });
    
            }
        });
       
            return;
    } else {

        console.log('okay', att.attendanceStatus)
        // If the last entry was made today, update the existing entry
        if (att.attendanceStatus === true) {
            // Visitor is currently checked in, so update the check-out time
            updateQuery = {
                checkOut: currentTime,
                attendanceStatus: false
            };
        } else {
            // Visitor is currently checked out, so update the check-in time
            updateQuery = {
                checkIn: currentTime,
                checkOut: null,
                attendanceStatus: true
            };
        }


    Attendance.findOneAndUpdate({ employeeId: att.employeeId }, updateQuery, { new: true }, async function (err, result) {
        if (err) {
            return res.status(401).json({
                status: 401,
                success: false,
                error: err
            });
        } else {
            const att2 = await Attendance.findOne({
                employeeId: req.payload.id, // Assuming req.payload.id is the user ID
                createdAt: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) } // Find documents created today
              });
            return res.status(200).json({
                status: 200,
                success: true,
                data: att2
            });

        }
    });
    }


        

    //     if (emp.attendanceStatus === true) {
    //     Visitor.findOneAndUpdate({ _id: req.params.id}, { 
    //         $set: { 
    //             // checkIn: checkInTime && checkInTime,
    //             // status: true
    //             checkOut: new Date(),
    //             attendanceStatus: false
                
    //         }
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

    //             } else {
    //                 res.status(200).json({
    //                     status: 200,
    //                     success: true,
    //                     data: "Update Successful"
    //                 })

    //             }
    //         })
    //     } else if(emp.attendanceStatus === false){
    //         Visitor.findOneAndUpdate({ _id: req.params.id}, { 
    //             $set: { 
    //                 // checkIn: checkInTime && checkInTime,
    //                 // status: true
    //                 checkIn: new Date(),
    //                 attendanceStatus: true
                    
    //             }
    //        },
    //             function (
    //                 err,
    //                 result
    //             ) {
    //                 if (err) {
    //                     res.status(401).json({
    //                         status: 401,
    //                         success: false,
    //                         error: err
    //                     })
    
    //                 } else {
    //                     res.status(200).json({
    //                         status: 200,
    //                         success: true,
    //                         data: "Update Successful"
    //                     })
    
    //                 }
    //             })
    //     }
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })
    }
}
export default checkInOut;