



import dotenv from 'dotenv';
import Role from '../../model/Role';
import Company from '../../model/Company';
import Leave from '../../model/Expense';
import PayrollPeriod from '../../model/PayrollPeriod';
import Employee from '../../model/Employees';
import PeriodPayData from '../../model/PeriodPayData';
import mongoose from 'mongoose';




const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);


const grossPay = async (req, res) => {

    try {
       

        let company = await Company.findOne({ _id: req.payload.id });

        let appraisal = await PayrollPeriod.findOne({ companyId:company._id,  });

        console.log({company})


        if (!company.companyName) {
            res.status(400).json({
                status: 400,
                error: 'No company has been created for this account'
            })
            return;
        }


        if (!appraisal) {
            res.status(400).json({
                status: 400,
                error: 'This period does not exist'
            })
            return;
        }


        const totalGrossPayByCompany = await PeriodPayData.aggregate([
            {
              $match: {
                companyId: company._id.toString(),
              },
            },
            {
              $group: {
                _id: '$id',
                totalGrossPay: {
                  $sum: {
                    $add: ['$basicPay', '$bonus', '$standard', '$pension', '$insurance', '$payeTax'],
                  },
                },
              },
            },
          ]);
        
          console.log('Total Gross Pay By Company:', totalGrossPayByCompany);
          console.log({totalGrossPayByCompany})
          
          res.status(200).json({
            status: 200,
            success: true,
            data:  totalGrossPayByCompany
        })
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })
    }
}
export default grossPay;