import dotenv from 'dotenv';
import Employee from '../../model/Employees';
import EmployeeTable from '../../model/EmployeeTable';

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
            page, limit, firstName, lastName, managerName, companyName,
            department, designation, employeeCode, gender, email, employmentStartDate 
        } = req.query;

        // Build filter object
        let filterQuery = {};
        
        if (firstName) filterQuery.firstName = { $regex: firstName, $options: 'i' };
        if (lastName) filterQuery.lastName = { $regex: lastName, $options: 'i' };
        if (managerName) filterQuery.managerName = { $regex: managerName, $options: 'i' };
        if (companyName) filterQuery.companyName = { $regex: companyName, $options: 'i' };
        if (department) filterQuery.department = { $regex: department, $options: 'i' };
        if (designation) filterQuery.designation = { $regex: designation, $options: 'i' };
        if (employeeCode) filterQuery.employeeCode = { $regex: employeeCode, $options: 'i' };
        if (gender) filterQuery.gender = { $regex: gender, $options: 'i' };
        if (email) filterQuery.email = { $regex: email, $options: 'i' };
        if (employmentStartDate) filterQuery.employmentStartDate = employmentStartDate;

        const employee = await Employee.findOne({_id: req.payload.id})

        const company = await Company.findOne({_id: req.payload.id})

        console.log({employee});
        console.log({company});


        if(employee){
            // Combine company filter with other filters
            filterQuery.companyId = employee.companyId;
            
            const employeeData = await Employee.find(filterQuery).sort({_id: -1})
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
            const employeeTable = await EmployeeTable.find()

            console.log({employeeData})

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
                    currentPage: page
                })
            }
        } else if(company)
            {
            // Combine company filter with other filters
            filterQuery.companyId = req.payload.id;
            
            const employeeData = await Employee.find(filterQuery).sort({_id: -1})
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
                        currentPage: page
                    })
                }
            } 
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })
    }
}
export default fetchEmployees;



