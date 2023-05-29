
import dotenv from 'dotenv';
import Company from '../../model/Company';
import bcrypt from 'bcrypt';


const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const fetchCompany = async (req, res) => {

    try {
       
        let company = await Company.findOne({ _id: req.payload.id }, {_id: 1, companyName:1})


        if (!company) {

            res.status(400).json({
                status: 400,
                error: 'This Company does not already exist'
            })
            return;
        }

     

        res.status(200).json({
            status: 200,
            data: company
        })


    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })
    }
}
export default fetchCompany;



