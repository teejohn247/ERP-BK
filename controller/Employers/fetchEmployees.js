import dotenv from 'dotenv';
import Employee from '../../model/Employees';
import EmployeeTable from '../../model/EmployeeTable';
import mongoose from 'mongoose';

import Roles from '../../model/Roles';


import utils from '../../config/utils';

import { emailTemp } from '../../emailTemplate';
import Company from '../../model/Company';


const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const fetchEmployees = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            firstName, 
            lastName, 
            managerName, 
            companyName, 
            department, 
            designation, 
            employeeCode, 
            gender, 
            email, 
            employmentStartDate, 
            search,
            sortBy = 'createdAt',
            sortOrder = -1
        } = req.query;

        // Build filter object
        let filterQuery = {};
        
        // Handle the combined search parameter
        if (search) {
            filterQuery.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { employeeCode: { $regex: search, $options: 'i' } }
            ];
        } else {
            // If no search parameter, use individual filters
            if (firstName) filterQuery.firstName = { $regex: firstName, $options: 'i' };
            if (lastName) filterQuery.lastName = { $regex: lastName, $options: 'i' };
        }

        if (managerName) filterQuery.managerName = { $regex: managerName, $options: 'i' };
        if (companyName) filterQuery.companyName = { $regex: companyName, $options: 'i' };
        if (department) filterQuery.department = { $regex: department, $options: 'i' };
        if (designation) filterQuery.designation = { $regex: designation, $options: 'i' };
        if (employeeCode) filterQuery.employeeCode = { $regex: employeeCode, $options: 'i' };
        if (gender) filterQuery.gender = { $regex: gender, $options: 'i' };
        if (email) filterQuery.email = { $regex: email, $options: 'i' };
        if (employmentStartDate) filterQuery.employmentStartDate = employmentStartDate;

        // Create sort object
        const sort = {};
        sort[sortBy] = parseInt(sortOrder);

        const company = await Company.findOne({_id: req.payload.id});
        const employee = await Employee.findOne({_id: req.payload.id});

        // Set appropriate companyId in filter
        if (employee) {
            filterQuery.companyId = mongoose.Types.ObjectId(employee.companyId);
        } else if (company) {
            filterQuery.companyId = mongoose.Types.ObjectId(req.payload.id);
        } else {
            return res.status(403).json({
                status: 403,
                success: false,
                message: 'Not authorized to view employees'
            });
        }

        // Fetch employees with pagination
        const employeeData = await Employee.find(filterQuery)
            .sort(sort)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .exec();
            
        // Get employee table data
        const employeeTable = await EmployeeTable.find();
        
        // Get total count for pagination
        const count = await Employee.countDocuments(filterQuery);

        if (!employeeData || employeeData.length === 0) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: 'No employees found',
                totalItems: 0,
                totalPages: 0,
                currentPage: parseInt(page),
                data: []
            });
        }
        
        // Return consistent response format with pagination at top level
        return res.status(200).json({
            status: 200,
            success: true,
            message: 'Employees fetched successfully',
            totalItems: count,
            totalPages: Math.ceil(count / parseInt(limit)),
            currentPage: parseInt(page),
            employeeTable,
            data: employeeData
        });

    } catch (error) {
        console.error("[fetchEmployees] Error:", error);
        return res.status(500).json({
            status: 500,
            success: false,
            message: 'An error occurred while fetching employees',
            error: error.message
        });
    }
};

export default fetchEmployees;



