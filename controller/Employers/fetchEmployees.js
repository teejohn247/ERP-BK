
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

        const { page, limit } = req.query;

        const employee = await Employee.findOne({_id: req.payload.id})

        const company = await Company.findOne({_id: req.payload.id})

        console.log({employee});
        console.log({company});


        if(employee){
            const emp = await Employee.find({companyId: employee.companyId}).sort({_id: -1})
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
            const employeeTable = await EmployeeTable.find()

            console.log({emp})

            const count = await Employee.find({companyId: employee.companyId}).countDocuments()
    
            if(!emp){
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
                    data: emp,
                    totalPages: Math.ceil(count / limit),
                    currentPage: page
                })
            }
        } else if(company)
            {
                const emp = await Employee.find({companyId: req.payload.id}).sort({_id: -1})
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

            console.log({emp})
                const employeeTable = await EmployeeTable.find()

                const count = await Employee.find({companyId: req.payload.id}).countDocuments()
        
                if(!emp){
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
                        data: emp,
                        totalPages: Math.ceil(count / limit),
                        currentPage: page
                    })
                }
            } 
k
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })
    }
}
export default fetchEmployees;



