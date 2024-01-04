
import dotenv from 'dotenv';
import Role from '../../model/Debit';
import PayrollPeriod from '../../model/PayrollPeriod';
import PeriodPayData from '../../model/PeriodPayData'



const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const fetchPayrollPeriodDetails = async (req, res) => {

    try {

        const { page, limit } = req.query;


        const role = await PayrollPeriod.find({_id: req.params.id})
        .sort({endDate: 1})
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();


        console.log(role)

        // let period = await PeriodPayData.findOne({ payrollPeriodId: adm._id});
        // console.log({period})

        const all = [];

        
        const promises = role.map(async (empp) => {
            console.log({ empp });
            
            const period = await PeriodPayData.find({ payrollPeriodId: empp._id });
            console.log({ period });
        
            all.push({
                ...empp.toObject(), // Convert Mongoose document to JS object
                payrollPeriodData: period.map(emp => ({
                  _id: emp._id,
                  companyId: emp.companyId,
                  companyName: emp.companyName,
                  payrollPeriodId: empp._id,
                  firstName: emp.firstName,
                  lastName: emp.lastName,
                  fullName: emp.fullName,
                  profilePic: emp.profilePic,
                  role: emp.role, // Assigning role field from Employee model
                  bonus: emp.bonus, // Example default values
                  standard: emp.standard,
                  basicPay: emp.basicPay,
                  pension: emp.pension,
                  insurance: emp.insurance,
                  payeTax: emp.payeTax,
                  status: emp.status, // Default status
                })),
              });
          
              // console.log({ all });
            });
        
          await Promise.all(promises).then(()=> {
            res.status(200).json({
                status: 200,
                success: true,
                data: all,
            });
          })

    } catch (error) {

        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })
    }
}
export default fetchPayrollPeriodDetails;