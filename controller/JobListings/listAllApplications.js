
import dotenv from 'dotenv';
import JobPost from '../../model/Form';
import Company from '../../model/Company';
import Employee from '../../model/Employees';


import { emailTemp } from '../../emailTemplate';


const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const listMasterApplications = async (req, res) => {

    try {

        const company = await Company.findOne({_id: req.payload.id});
        const employee = await Employee.findOne({_id: req.payload.id});

        console.log(req.payload.id)
        console.log({company})

        console.log({employee})


        if(company) {

        const role = await JobPost.find({companyId: req.payload.id})

        console.log({role})

        if(!role){
            res.status(404).json({
                status:404,
                success: false,
                error:'No JobPost Found'
            })
            return
        
        }else{
            res.status(200).json({
                status: 200,
                success: true,
                data: role,
            })
        }
    }else{
        const role = await JobPost.find({companyId: employee.companyId})

        // console.log(role)

        if(!role){
            res.status(404).json({
                status:404,
                success: false,
                error:'No JobPost Found'
            })
            return
        
        }else{
            res.status(200).json({
                status: 200,
                success: true,
                data: role,
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
export default listMasterApplications;



