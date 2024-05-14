// import dotenv from 'dotenv';
// import Company from '../../model/Company';
// import Employee from '../../model/Employees';
// import StaffAttendance from '../../model/StaffAttendance';

// import { emailTemp } from '../../emailTemplate';

// const sgMail = require('@sendgrid/mail');

// dotenv.config();

// sgMail.setApiKey(process.env.SENDGRID_KEY);

// const fetchTodaysAttendance = async (req, res) => {
//     try {
//         const { page, limit } = req.query;

//         const currentDate = new Date();

//         // Find the company ID associated with the request payload
//         const companyId = req.payload.id;

//         // Find the company details
//         const company = await Company.findOne({ _id: companyId });

//         // If company not found, return error
//         if (!company) {
//             return res.status(404).json({
//                 status: 404,
//                 success: false,
//                 error: 'Company not found'
//             });
//         }

//         // Define filter for today's attendance
//         const startOfDay = new Date(currentDate);
//         startOfDay.setHours(0, 0, 0, 0); // Set time to 00:00:00
//         const endOfDay = new Date(currentDate);
//         endOfDay.setHours(23, 59, 59, 999); // Set time to 23:59:59.999
//         const filter = {
//             companyId,
//             createdAt: {
//                 $gte: startOfDay,
//                 $lte: endOfDay
//             }
//         };

//         // Fetch today's attendance records
//         const roles = await StaffAttendance.find(filter)
//             .limit(limit * 1)
//             .skip((page - 1) * limit)
//             .exec();

//         const count = await StaffAttendance.countDocuments(filter);

//         if (count === 0) {
//             return res.status(404).json({
//                 status: 404,
//                 success: false,
//                 error: 'No attendance records found for the current day'
//             });
//         }

//         res.status(200).json({
//             status: 200,
//             success: true,
//             data: roles,
//             totalPages: Math.ceil(count / limit),
//             currentPage: page
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: 500,
//             success: false,
//             error: error.message
//         });
//     }
// };

// export default fetchTodaysAttendance;



import dotenv from 'dotenv';
import Company from '../../model/Company';
import Employee from '../../model/Employees';
import StaffAttendance from '../../model/StaffAttendance';

import { emailTemp } from '../../emailTemplate';

const sgMail = require('@sendgrid/mail');

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_KEY);

const fetchTodaysAttendance = async (req, res) => {
    try {
        const { page, limit, startDate, endDate } = req.query;

        const currentDate = new Date();

        // Find the company ID associated with the request payload
        const companyId = req.payload.id;
        


        // Find the company details
        const company = await Company.findOne({ _id: companyId });

        
 if(company){
        // If company not found, return error
        if (!company) {
            return res.status(404).json({
                status: 404,
                success: false,
                error: 'Company not found'
            });
        }

        let filter = {
            companyId,
            createdAt: {
                $gte: new Date(currentDate.setHours(0, 0, 0, 0)), // Set time to 00:00:00
                $lte: new Date(currentDate.setHours(23, 59, 59, 999)) // Set time to 23:59:59.999
            }
        };

        // If start date and end date are provided, update filter
        if (startDate && endDate) {
            filter.createdAt.$gte = new Date(startDate);
            filter.createdAt.$lte = new Date(endDate);
        }

        // Fetch attendance records based on filter
        const roles = await StaffAttendance.find(filter)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await StaffAttendance.countDocuments(filter);

        if (count === 0) {
            return res.status(404).json({
                status: 404,
                success: false,
                error: 'No attendance records found for the selected date range'
            });
        }

        res.status(200).json({
            status: 200,
            success: true,
            data: roles,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } else {

        const emp = await Employee.findOne({ _id: req.payload.id});


          
            let filter = {
                companyId: emp.companyId,
                createdAt: {
                    $gte: new Date(currentDate.setHours(0, 0, 0, 0)), // Set time to 00:00:00
                    $lte: new Date(currentDate.setHours(23, 59, 59, 999)) // Set time to 23:59:59.999
                }
            };
    
            // If start date and end date are provided, update filter
            if (startDate && endDate) {
                filter.createdAt.$gte = new Date(startDate);
                filter.createdAt.$lte = new Date(endDate);
            }
    
            // Fetch attendance records based on filter
            const roles = await StaffAttendance.find(filter)
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec();
    
            const count = await StaffAttendance.countDocuments(filter);
    
            if (count === 0) {
                return res.status(404).json({
                    status: 404,
                    success: false,
                    error: 'No attendance records found for the selected date range'
                });
            }
    
            res.status(200).json({
                status: 200,
                success: true,
                data: roles,
                totalPages: Math.ceil(count / limit),
                currentPage: page
            });

    }
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            error: error.message
        });
    }
};

export default fetchTodaysAttendance;

