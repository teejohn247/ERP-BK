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
        const { 
            page = 1, 
            limit = 10, 
            startDate, 
            endDate,
            status,
            search = '',
            department,
            sortBy = 'createdAt',
            sortOrder = -1
        } = req.query;

        const currentDate = new Date();

        // Find the company ID associated with the request payload
        const companyId = req.payload.id;
        
        // Create sort object
        const sort = {};
        sort[sortBy] = parseInt(sortOrder) || -1;

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
                companyId
            };

            // If no dates provided, default to today
            if (!startDate && !endDate) {
                filter.createdAt = {
                    $gte: new Date(currentDate.setHours(0, 0, 0, 0)),
                    $lte: new Date(currentDate.setHours(23, 59, 59, 999))
                };
            } 
            // If dates are provided, use them
            else if (startDate && endDate) {
                filter.createdAt = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                };
            } else if (startDate) {
                filter.createdAt = { $gte: new Date(startDate) };
            } else if (endDate) {
                filter.createdAt = { $lte: new Date(endDate) };
            }

            // Add status filter if provided
            if (status) {
                filter.status = status;
            }

            // Add department filter if provided
            if (department) {
                filter.department = department;
            }

            // Add search functionality
            if (search) {
                filter.$or = [
                    { employeeName: { $regex: search, $options: 'i' } },
                    { department: { $regex: search, $options: 'i' } },
                    { notes: { $regex: search, $options: 'i' } }
                ];
            }

            // Fetch attendance records based on filter
            const roles = await StaffAttendance.find(filter)
                .sort(sort)
                .limit(parseInt(limit))
                .skip((parseInt(page) - 1) * parseInt(limit))
                .exec();

            const count = await StaffAttendance.countDocuments(filter);

            if (count === 0) {
                return res.status(404).json({
                    status: 404,
                    success: false,
                    error: 'No attendance records found for the selected filters'
                });
            }

            res.status(200).json({
                status: 200,
                success: true,
                data: roles,
                totalRecords: count,
                totalPages: Math.ceil(count / parseInt(limit)),
                currentPage: parseInt(page),
                limit: parseInt(limit)
            });
        } else {
            const emp = await Employee.findOne({ _id: req.payload.id});

            if (!emp) {
                return res.status(404).json({
                    status: 404,
                    success: false,
                    error: 'Employee not found'
                });
            }

            let filter = {
                companyId: emp.companyId
            };

            // If no dates provided, default to today
            if (!startDate && !endDate) {
                filter.createdAt = {
                    $gte: new Date(currentDate.setHours(0, 0, 0, 0)),
                    $lte: new Date(currentDate.setHours(23, 59, 59, 999))
                };
            } 
            // If dates are provided, use them
            else if (startDate && endDate) {
                filter.createdAt = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                };
            } else if (startDate) {
                filter.createdAt = { $gte: new Date(startDate) };
            } else if (endDate) {
                filter.createdAt = { $lte: new Date(endDate) };
            }

            // Add status filter if provided
            if (status) {
                filter.status = status;
            }

            // Add department filter if provided
            if (department) {
                filter.department = department;
            }

            // Add search functionality
            if (search) {
                filter.$or = [
                    { employeeName: { $regex: search, $options: 'i' } },
                    { department: { $regex: search, $options: 'i' } },
                    { notes: { $regex: search, $options: 'i' } }
                ];
            }
    
            // Fetch attendance records based on filter
            const roles = await StaffAttendance.find(filter)
                .sort(sort)
                .limit(parseInt(limit))
                .skip((parseInt(page) - 1) * parseInt(limit))
                .exec();
    
            const count = await StaffAttendance.countDocuments(filter);
    
            if (count === 0) {
                return res.status(404).json({
                    status: 404,
                    success: false,
                    error: 'No attendance records found for the selected filters'
                });
            }
    
            res.status(200).json({
                status: 200,
                success: true,
                data: roles,
                totalRecords: count,
                totalPages: Math.ceil(count / parseInt(limit)),
                currentPage: parseInt(page),
                limit: parseInt(limit)
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

