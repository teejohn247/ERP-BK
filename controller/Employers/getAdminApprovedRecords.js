import dotenv from 'dotenv';
import Employee from '../../model/Employees';
import EmployeeTable from '../../model/EmployeeTable';

import Roles from '../../model/Roles';


import utils from '../../config/utils';

import { emailTemp } from '../../emailTemplate';
import LeaveRecords from '../../model/LeaveRecords';


const sgMail = require('@sendgrid/mail')

dotenv.config();


sgMail.setApiKey(process.env.SENDGRID_KEY);



const getAdminApprovedRecords = async (req, res) => {

    try {

        const { 
            page = 1, 
            limit = 10,
            search = '',
            startDate,
            endDate,
            leaveType,
            department,
            sortBy = 'createdAt',
            sortOrder = -1
        } = req.query;

        // Build filter object
        let filterQuery = { 
            leaveApprover: req.params.id, 
            status: "Approved" 
        };
        
        // Add date range filters if provided
        if (startDate && endDate) {
            filterQuery.leaveStartDate = { $gte: new Date(startDate) };
            filterQuery.leaveEndDate = { $lte: new Date(endDate) };
        } else if (startDate) {
            filterQuery.leaveStartDate = { $gte: new Date(startDate) };
        } else if (endDate) {
            filterQuery.leaveEndDate = { $lte: new Date(endDate) };
        }
        
        // Add leaveType filter if provided
        if (leaveType) {
            filterQuery.leaveType = leaveType;
        }
        
        // Add department filter if provided
        if (department) {
            filterQuery.department = department;
        }
        
        // Add search functionality
        if (search) {
            filterQuery.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { fullName: { $regex: search, $options: 'i' } },
                { reason: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Create sort object
        const sort = {};
        sort[sortBy] = parseInt(sortOrder) || -1;
        
        // Get total count for pagination
        const count = await LeaveRecords.find(filterQuery).countDocuments();

        const employee = await LeaveRecords.find(filterQuery)
            .sort(sort)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .exec();

        console.log({employee})

        if(!employee || employee.length === 0){
            res.status(404).json({
                status:404,
                success: false,
                error:'No approved records found'
            })
            return
        }else{
            res.status(200).json({
                status: 200,
                success: true,
                data: employee,
                totalRecords: count,
                totalPages: Math.ceil(count / parseInt(limit)),
                currentPage: parseInt(page),
                limit: parseInt(limit)
            })
        }

    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })
    }
}
export default getAdminApprovedRecords;



