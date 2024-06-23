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

const dailyAttendance = async (req, res) => {
    try {
        // Get the current date
        const currentDate = new Date();
        const currentDateOnly = new Date(currentDate.toISOString().split('T')[0]); // Extract date part only

        // Find all companies
        const companies = await Company.find({});

        // Iterate over each company
        for (const company of companies) {
            // Delete existing attendance entries for the current date and company
            await StaffAttendance.deleteMany({
                companyId: company._id,
                date: {
                    $gte: currentDateOnly, // Greater than or equal to current date
                    $lt: new Date(currentDateOnly.getTime() + 24 * 60 * 60 * 1000) // Less than next day
                }
            });

            // Find employees of the current company
            const employees = await Employee.find({ companyId: company._id })
                .sort({ _id: -1 })
                .exec();

            // If no employees found, log and continue to next company
            if (employees.length === 0) {
                console.log(`No employees found for company with ID: ${company._id}`);
                continue;
            }

            // Create StaffAttendance entries for each employee
            const employeeTablePromises = employees.map(async (emp) => {
                const group = new StaffAttendance({
                    companyId: emp.companyId,
                    companyName: emp.companyName,
                    employeeId: emp._id,
                    employeeImage: emp.profilePic,
                    employeeName: emp.fullName,
                    department: emp.department,
                    departmentId: emp.departmentId,
                    date: currentDateOnly,
                    phoneNumber: emp.phoneNumber,
                });

                try {
                    const savedEmployee = await group.save();
                    console.log(savedEmployee);
                    // savedEmployees.push(savedEmployee); // You may not need to push each saved entry into an array
                } catch (err) {
                    console.error(err);
                    throw err;
                }
            });

            // Wait for all StaffAttendance entries to be saved for this company
            await Promise.all(employeeTablePromises);
        }

        console.log("Daily attendance operation completed");
        res.status(200).json({
            status: 200,
            success: true,
            data: "New Attendance Sheet Created"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            success: false,
            error: "Failed to create attendance sheet"
        });
    }
};

export default dailyAttendance;
