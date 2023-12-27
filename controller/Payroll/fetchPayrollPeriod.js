
import dotenv from 'dotenv';
import Role from '../../model/Debit';
import PayrollPeriod from '../../model/PayrollPeriod';



const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const fetchPayrollPeriod = async (req, res) => {

    try {

        const { page, limit } = req.query;


        const role = await PayrollPeriod.find({companyId: req.payload.id})
        .sort({_id: -1})
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

        const count = await PayrollPeriod.find({companyId: req.payload.id}).countDocuments()

        console.log(role)

        res.status(200).json({
            status: 200,
            success: true,
            data: role,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });

    } catch (error) {

        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })
    }
}
export default fetchPayrollPeriod;



