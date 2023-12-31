
import dotenv from 'dotenv';
import Role from '../../model/ExpenseRequests';
import Leave from '../../model/LeaveRecords';



import { emailTemp } from '../../emailTemplate';


const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const fetchAllReqsAdmin = async (req, res) => {

    try {

        const { page, limit } = req.query;


        const role = await Role.find({approverId: req.payload.id}).sort({ "dateRequested": -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

        const leave = await Expense.find({approverId: req.payload.id}).sort({ "dateRequested": -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

        const count = await Role.find({approverId: req.payload.id}).countDocuments()

        console.log(role)

        res.status(200).json({
            status: 200,
            success: true,
            leaveRequests: leave,
            expenseRequests: role,
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
export default fetchAllReqsAdmin;



