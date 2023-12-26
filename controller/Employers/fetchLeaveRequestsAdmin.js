
import dotenv from 'dotenv';
import Role from '../../model/ExpenseRequests';


import { emailTemp } from '../../emailTemplate';


const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const fetchExpenseReqsAdmin = async (req, res) => {

    try {

        const { page, limit } = req.query;


        const role = await Role.find({approvalId: req.payload.id}).sort({ "dateRequested": -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

        const count = await Role.find({approvalId: req.payload.id}).countDocuments()

        console.log(role)

        res.status(200).json({
            status: 200,
            success: true,
            data: role,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        })

        return;

     
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })
    }
}
export default fetchExpenseReqsAdmin;



