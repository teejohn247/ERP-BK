
import dotenv from 'dotenv';
import Employee from '../../model/ExpenseRequests';
import Roles from '../../model/Roles';
import AuditTrail from '../../model/AuditTrail';
import Company from '../../model/Company';
import utils from '../../config/utils';
import { emailTemp } from '../../emailTemplate';
import moment from 'moment';


const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const approveExpense = async (req, res) => {

    try {
   
        const { status, comment, requestId, approved } = req.body;

        const check = await Employee.findOne({ _id: requestId })
        let company = await Company.find({ _id: req.payload.id });


        if (!check) {
            res.status(400).json({
                status: 400,
                error: "Expense Request doesn't exist"
            })
            return;
        }
      
        Employee.findOneAndUpdate({ _id: requestId}, { 
            $set: { 
                status,
                dateOfApproval:  new Date().toISOString(),
                approved,
                comment
            }
       },
            function (
                err,
                result
            ) {
                if (err) {
                    res.status(401).json({
                        status: 401,
                        success: false,
                        error: err

                    })

                } else {
                    res.status(200).json({
                        status: 200,
                        success: true,
                        data: "Status Updated Successfully"
                    })

                }
            })



    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })
    }
}
export default approveExpense;



