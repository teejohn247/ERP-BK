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

        const { page, limit, firstName, lastName, managerName, companyName, 
            department, designation, employeeCode, gender, email, employmentStartDate, search } = req.query;

        // Build filter object
        let filterQuery = {};
        
        // Handle the combined search parameter
        if (search) {
            filterQuery.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } }
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

        const company = await Company.findOne({_id: req.payload.id});
        const employee = await Employee.findOne({_id: req.payload.id});

        console.log({filterQuery});
        console.log({company});
   


        if(employee){
            filterQuery.companyId = mongoose.Types.ObjectId(employee.companyId);
            
            const employeeData = await Employee.find(filterQuery)
                .sort({_id: -1})
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec();
            const employeeTable = await EmployeeTable.find()

            console.log({employeeData}, {companyId: mongoose.Types.ObjectId(employee.companyId)})

            const count = await Employee.find(filterQuery).countDocuments()


            if(!employeeData){
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
                    employeeTable,
                    data: employeeData,
                    totalPages: Math.ceil(count / limit),
                    currentPage: parseInt(page),
                    totalRecords: count
                })
                return
            }
        } else if(company)
            {
                console.log(req.payload.id)
                filterQuery.companyId = mongoose.Types.ObjectId(req.payload.id);
                
                const employeeData = await Employee.find(filterQuery)
                    .sort({_id: -1})
                    .limit(limit * 1)
                    .skip((page - 1) * limit)
                    .exec();
     

            console.log({employeeData})
                const employeeTable = await EmployeeTable.find()

                const count = await Employee.find(filterQuery).countDocuments()

                console.log({count})
        
                if(!employeeData){
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
                        employeeTable,
                        data: employeeData,
                        totalPages: Math.ceil(count / limit),
                        currentPage: parseInt(page),
                        totalRecords: count
                    })
                    return
                }
            } 

    } catch (error) {
        console.error("[fetchEmployees] Error:", error);
        res.status(500).json({
            status: 500,
            success: false,
            error: error.message || 'An error occurred while fetching employees'
        })
    }
}
export default fetchEmployees;



