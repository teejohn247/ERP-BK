import dotenv from 'dotenv';
import Company from '../../../model/Company';
import Admin from '../../../model/AceERP';

import bcrypt from 'bcrypt';


const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const fetchAllCompanies = async (req, res) => {
    try {
        // Check if request is from AceERP admin
        const requestingUser = await Admin.findOne({ _id: req.payload.id });
        console.log({requestingUser})
        if (requestingUser.email !== 'siloerp@silo-inc.com') {
            return res.status(403).json({
                status: 403,
                error: 'Unauthorized access. Only SILO admin can fetch all companies.'
            });
        }

        // Fetch all companies with selected fields
        const companies = await Company.find({});
        
        res.status(200).json({
            status: 200,
            data: companies
        });

    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            error: error.message
        });
    }
}
export default fetchAllCompanies;



