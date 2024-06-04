import dotenv from 'dotenv';
import Employee from '../../model/Employees';
import EmployeeTable from '../../model/EmployeeTable';
import StaffAttendance from '../../model/StaffAttendance';
import Company from '../../model/Company';

import Roles from '../../model/Roles';

import utils from '../../config/utils';

import { emailTemp } from '../../emailTemplate';

const sgMail = require('@sendgrid/mail');

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_KEY);

const signOutUsers = async (req, res) => {
    try {
        // Get the current date
        const currentDate = new Date();

        // Find all companies
        const companies = await Company.find({});

        // Array to hold saved employees across all companies
        let savedEmployees = [];

        // Iterate over each company
        for (const company of companies) {
           
            // Find employees of the current company
            const employees = await Employee.find({ companyId: company._id, checkoutTime: undefined })
                .sort({ _id: -1 })
                .exec();

            // If no employees found, log and continue to next company
            if (employees.length === 0) {
                console.log(`No employees found for company with ID: ${company._id}`);
                return;
            }

            updateQuery = {
                checkOut: currentDate,
                checkOutBySystem: true
            };
    
        console.log({updateQuery})
    
        StaffAttendance.updateMany({ employeeId: att.employeeId }, updateQuery, { new: true }, async function (err, result) {
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

        res.status(200).json({
            status: 200,
            success: true,
            data: savedEmployees
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            success: false,
            error: error.message
        });
    }
};

export default signOutUsers;
