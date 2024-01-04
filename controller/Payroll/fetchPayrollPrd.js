
import dotenv from 'dotenv';
import Payroll from '../../model/Payroll';
import PayrollPeriod from '../../model/PayrollPeriod';
import PeriodPayData from '../../model/PeriodPayData'



const sgMail = require('@sendgrid/mail')

dotenv.config();



sgMail.setApiKey(process.env.SENDGRID_KEY);



const fetchPayrollPrd = async (req, res) => {

    try {

        const { page, limit } = req.query;


        // companyName: { type: String },
        // companyId: { type: String },
        // payrollPeriodName: { type: String },
        // description: { type: String },
        // startDate: { type: String },
        // endDate: { type: String },
        // reference: { type: String },
        // status: {type: String, default: 'Pending'},

        const totals = await PeriodPayData.aggregate([
            {
              $lookup: {
                from: 'payrollperiods', // Replace 'payrollperiods' with the actual collection name of PayrollPeriod
                localField: 'payrollPeriodId',
                foreignField: '_id',
                as: 'payrollPeriodData',
              },
            },
            {
              $unwind: '$payrollPeriodData', // Unwind to flatten the array if needed
            },
            {
              $group: {
                _id: '$payrollPeriodId', // Group by PayrollPeriod _id
                payrollPeriodName: { $first: '$payrollPeriodData.payrollPeriodName' },
                startDate: { $first: '$payrollPeriodData.startDate' },
                endDate: { $first: '$payrollPeriodData.endDate' },
                reference: { $first: '$payrollPeriodData.reference' },
                status: { $first: '$payrollPeriodData.status' },
                totalGrossPay: { $sum: { $add: ['$basicPay', '$bonus', '$standard', '$pension', '$insurance', '$payeTax'] } },
                totalNetPay: { $sum: '$netPay' },
                totalDeductions: { $sum: { $add: ['$bonus', '$standard', '$pension', '$insurance', '$payeTax'] } },
                // You can include other fields from PayrollPeriod if needed
              },
            },
          ]);

          console.log({totals})



      
          res.status(200).json({
            status: 200,
            success: true,
            data: totals,
            // totalPages: Math.ceil(count / limit),
            // currentPage: page
        });
        return


        const role = await Payroll.find({companyId: req.payload.id})
        .sort({_id: -1})
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

        const count = await Payroll.find({companyId: req.payload.id}).countDocuments()

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
export default fetchPayrollPrd;



