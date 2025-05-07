import dotenv from 'dotenv';
import Employee from '../../model/Employees';
import EmployeeTable from '../../model/EmployeeTable';

import Roles from '../../model/Roles';


import utils from '../../config/utils';

import { emailTemp } from '../../emailTemplate';
import LeaveRecords from '../../model/LeaveRecords';
import Company from '../../model/Company';



const sgMail = require('@sendgrid/mail')

dotenv.config();


sgMail.setApiKey(process.env.SENDGRID_KEY);



const getAdminRecords = async (req, res) => {

    try {

        const { 
            page = 1, 
            limit = 10, 
            firstName,
            lastName,
            fullName,
            leaveTypeName,
            status,
            department,
            startDate,
            endDate,
            approved,
            sortBy = 'createdAt',
            sortOrder = -1
        } = req.query;

        const comp = await Employee.findOne({_id: req.payload.id})
        const allComp = await Company.findOne({_id: req.payload.id})

        console.log({comp})
        console.log({allComp})

        // Build filter object
        let filterQuery = {};

        if (firstName) filterQuery.firstName = { $regex: firstName, $options: 'i' };
        if (lastName) filterQuery.lastName = { $regex: lastName, $options: 'i' };
        if (fullName) {
            filterQuery.$or = [
                { firstName: { $regex: fullName, $options: 'i' } },
                { lastName: { $regex: fullName, $options: 'i' } }
            ];
        }
        if (leaveTypeName) filterQuery.leaveTypeName = leaveTypeName;
        if (status) filterQuery.status = status;
        if (department) filterQuery.department = department;
        if (approved !== undefined) filterQuery.approved = approved === 'true';

        // Add date range filters
        if (startDate || endDate) {
            filterQuery.leaveDate = {};
            if (startDate) filterQuery.leaveDate.$gte = new Date(startDate);
            if (endDate) filterQuery.leaveDate.$lte = new Date(endDate);
        }
        
        // Create sort object
        const sort = {};
        sort[sortBy] = parseInt(sortOrder) || -1;

        if(comp){
            const finalFilter = {
                ...filterQuery,
                companyId: comp.companyId, 
                leaveApprover: req.payload.id
            };
            
            // Get count for pagination
            const count = await LeaveRecords.find(finalFilter).countDocuments();
            
            const employee = await LeaveRecords.find(finalFilter)
                .sort(sort)
                .limit(parseInt(limit))
                .skip((parseInt(page) - 1) * parseInt(limit))
                .exec();
    
            console.log({employee})
    
            if(!employee || employee.length === 0){
                res.status(404).json({
                    status:404,
                    success: false,
                    error:'No employee Found'
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
            return
        } else if(allComp){
            const finalFilter = {
                ...filterQuery,
                companyId: req.payload.id
            };
            
            // Get count for pagination
            const count = await LeaveRecords.find(finalFilter).countDocuments();
            
            const employee = await LeaveRecords.find(finalFilter)
                .sort(sort)
                .limit(parseInt(limit))
                .skip((parseInt(page) - 1) * parseInt(limit))
                .exec();
    
            console.log({employee})
    
            if(!employee || employee.length === 0){
                res.status(404).json({
                    status:404,
                    success: false,
                    error:'No employee Found'
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
            return
        }


    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })
    }
}
export default getAdminRecords;



