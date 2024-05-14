
import dotenv from 'dotenv';
// import Role from '../../model/Visitor';
import Company from '../../model/Company';
import Employee from '../../model/Employees';
import StaffAttendance from '../../model/StaffAttendance';


import { emailTemp } from '../../emailTemplate';


const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const fetchAttendance = async (req, res) => {

    try {

        const { page, limit } = req.query;

        const comp = await Company.findOne({_id: req.payload.id})

        if(comp){
            // const role = await StaffAttendance.find({companyId: req.payload.id})
            // .limit(limit * 1)
            // .skip((page - 1) * limit)
            // .exec();
    
            // const count = await StaffAttendance.find({companyId: req.payload.id}).countDocuments()
    
            // console.log(role)



 // Get the current date
 const currentDate = new Date();
 // Calculate the date for the previous day
 const previousDate = new Date(currentDate);
 previousDate.setDate(previousDate.getDate() - 1);

 let filterPreviousDay = {
     companyId: req.payload.id,
     timestamp: {
         $gte: new Date(previousDate.getFullYear(), previousDate.getMonth(), previousDate.getDate()), // Start of the previous day
         $lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) // End of the previous day
     }
 };

 let role = await StaffAttendance.find(filterPreviousDay)
     .limit(limit * 1)
     .skip((page - 1) * limit)
     .exec();

 let count = await StaffAttendance.countDocuments(filterPreviousDay);

 // If no attendance records found for the previous day, try fetching records for the current day
 if (count === 0) {
     let filterCurrentDay = {
         companyId: req.payload.id,
         timestamp: {
             $gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()), // Start of the current day
             $lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1) // End of the current day
         }
     };

     role = await StaffAttendance.find(filterCurrentDay)
         .limit(limit * 1)
         .skip((page - 1) * limit)
         .exec();

     count = await StaffAttendance.countDocuments(filterCurrentDay);
 }

 if (count === 0) {
     return res.status(404).json({
         status: 404,
         success: false,
         error: 'No attendance records found for the previous day or current day'
     });
 }

 res.status(200).json({
     status: 200,
     success: true,
     data: role,
     totalPages: Math.ceil(count / limit),
     currentPage: page
 });

        }else{
            const emp = await StaffAttendance.findOne({ employeeId: req.payload.id });

    if (!emp) {
        return res.status(404).json({
            status: 404,
            success: false,
            error: 'No attendance record found for this employee'
        });
    }

    // Get the current date
    const currentDate = new Date();
    // Calculate the date for the previous day
    const previousDate = new Date(currentDate);
    previousDate.setDate(previousDate.getDate() - 1);

    let filterPreviousDay = {
        companyId: emp.companyId,
        timestamp: {
            $gte: new Date(previousDate.getFullYear(), previousDate.getMonth(), previousDate.getDate()), // Start of the previous day
            $lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) // End of the previous day
        }
    };

    let role = await StaffAttendance.find(filterPreviousDay)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

    let count = await StaffAttendance.countDocuments(filterPreviousDay);

    // If no records found for the previous day, try fetching records for the current day
    if (count === 0) {
        let filterCurrentDay = {
            companyId: emp.companyId,
            timestamp: {
                $gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()), // Start of the current day
                $lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1) // End of the current day
            }
        };

        role = await StaffAttendance.find(filterCurrentDay)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        count = await StaffAttendance.countDocuments(filterCurrentDay);
    }

    if (count === 0) {
        return res.status(404).json({
            status: 404,
            success: false,
            error: 'No attendance records found for the previous day or current day'
        });
    }

    res.status(200).json({
        status: 200,
        success: true,
        data: role,
        totalPages: Math.ceil(count / limit),
        currentPage: page
    });
            // const emp = await StaffAttendance.findOne({_id: req.payload.id})

            // const role = await Role.find({companyId: emp.companyId})
            // .limit(limit * 1)
            // .skip((page - 1) * limit)
            // .exec();
    
            // const count = await StaffAttendance.find({companyId: emp.companyId}).countDocuments()
    
            // console.log(role)
    
            // if(!role){
            //     res.status(404).json({
            //         status:404,
            //         success: false,
            //         error:'No booked visit'
            //     })
            //     return
            
            // }else{
            //     res.status(200).json({
            //         status: 200,
            //         success: true,
            //         data: role,
            //         totalPages: Math.ceil(count / limit),
            //         currentPage: page
            //     })
            // }
        } 
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })
    }
}
export default fetchAttendance;