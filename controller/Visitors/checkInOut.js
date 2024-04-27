
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

    if (lastCheckInDate !== currentDate) {

        // companyName: { type: String },
        // companyId: { type: String },
        // employeeId:{ type: String },
        // employeeName:{ type: String },
        // departmentId: { type: String,  trim: true },
        // department: { type: String, required: true, trim: true },
        // checkIn:{ type: Date },
        // checkOut:{ type: Date },
        // email: { type: String },
        // If the last entry was not made today, create a new entry
        // updateQuery = {
        //     checkIn: currentTime,
        //     checkedInStatus: "Active"
        // };

        console.log('here')

        let group = new Attendance ({
            companyId: emp.companyId,
            companyName: emp.companyName,
            employeeId: req.payload.id,
            employeeName: emp.fullName,
            department: emp.department,
            departmentId:emp.departmentId,
            email: emp.email,
            checkIn: currentTime,
            checkedInStatus: "Active" 
        })

        console.log("here2")
        await group.save().then((adm) => {
            console.log(adm)
            res.status(200).json({
                status: 200,
                success: true,
                data: adm
            })
            return;
        }).catch((err) => {
                console.error(err)
                res.status(400).json({
                    status: 400,
                    success: false,
                    error: err
                })
            })
            return;
    } else {

        console.log('okay', att.checkedInStatus)
        // If the last entry was made today, update the existing entry
        if (att.checkedInStatus === "Active") {
            // Visitor is currently checked in, so update the check-out time
            updateQuery = {
                checkOut: currentTime,
                checkedInStatus: "Inactive"
            };
        } else {
            // Visitor is currently checked out, so update the check-in time
            updateQuery = {
                checkIn: currentTime,
                checkedInStatus: "Active"
            };
        }
    }

    console.log({updateQuery})

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

            return;
        }
    });

        

    //     if (emp.checkedInStatus === "Active") {
    //     Visitor.findOneAndUpdate({ _id: req.params.id}, { 
    //         $set: { 
    //             // checkIn: checkInTime && checkInTime,
    //             // status: "Active"
    //             checkOut: new Date(),
    //             checkedInStatus: "Inactive"
                
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
    //     } else if(emp.checkedInStatus === "Inactive"){
    //         Visitor.findOneAndUpdate({ _id: req.params.id}, { 
    //             $set: { 
    //                 // checkIn: checkInTime && checkInTime,
    //                 // status: "Active"
    //                 checkIn: new Date(),
    //                 checkedInStatus: "Active"
                    
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