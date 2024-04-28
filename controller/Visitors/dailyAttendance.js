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

const dailyAttendance = async () => {
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
                // Check if attendance already exists for the given date, employee, and company
                const existingAttendance = await StaffAttendance.findOne({ companyId: company._id, employeeId: emp._id, date: currentDate });

                if (existingAttendance) {
                    console.log(`Attendance already exists for employee ${emp._id} in company ${company._id} for the given date`);
                    return; // Skip processing for this employee
                }

                const group = new StaffAttendance({
                    companyId: emp.companyId,
                    companyName: emp.companyName,
                    employeeId: emp._id,
                    employeeImage: emp.profilePic,
                    employeeName: emp.fullName,
                    department: emp.department,
                    departmentId: emp.departmentId,
                    date: currentDate,
                    // checkIn: emp.checkIn,
                    phoneNumber: emp.phoneNumber,
                    // checkOut: emp.checkOut,
                });

                try {
                    const savedEmployee = await group.save();
                    console.log(savedEmployee);
                    savedEmployees.push(savedEmployee);
                } catch (err) {
                    console.error(err);
                    throw err;
                }
            });

            // Wait for all StaffAttendance entries to be saved for this company
            await Promise.all(employeeTablePromises);
        }

        console.log("Daily attendance operation completed");
        return savedEmployees;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export default dailyAttendance;
