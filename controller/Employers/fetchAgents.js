
import dotenv from 'dotenv';
import Employee from '../../model/Agent';
import EmployeeTable from '../../model/EmployeeTable';

import Roles from '../../model/Roles';


import utils from '../../config/utils';

import { emailTemp } from '../../emailTemplate';


const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const fetchAgents = async (req, res) => {

    try {

        const { page, limit } = req.query;

        const employee = await Employee.find({companyId: req.payload.id}).sort({_id: -1})
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

        

        const count = await Employee.find().countDocuments()

        if(!employee){
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
                totalPages: Math.ceil(count / limit),
                currentPage: page
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
export default fetchAgents;


