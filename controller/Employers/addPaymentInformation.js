
import dotenv from 'dotenv';
import Employee from '../../model/Employees';
import Roles from '../../model/Roles';


import utils from '../../config/utils';

import { emailTemp } from '../../emailTemplate';


const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const addPayment = async (req, res) => {

    try {
   
        const { bankAddress, bankName, accountNumber, sortCode, TaxIndentificationNumber} = req.body;

        const check = await Employee.findOne({ _id: req.params.id })



        if (!check) {
            res.status(400).json({
                status: 400,
                error: "Employee doesn't exist"
            })
            return;
        }

        // console.log(check.paymentInformation[0]._id)

        if (check.paymentInformation && check.paymentInformation.length < 1) {
          console.log('kjds')
        Employee.findOneAndUpdate({ _id: req.params.id}, 
            { $push: { paymentInformation: { 
    
                bankName: bankName && bankName,
                bankAddress: bankAddress && bankAddress,
                accountNumber: accountNumber && accountNumber,
                sortCode: sortCode && sortCode,
                TaxIndentificationNumber: TaxIndentificationNumber && TaxIndentificationNumber
    
             } }
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
                            data: "Update Successful"
                        })
    
                    }
                })
        }else{
            console.log('2kjds')

            Employee.findOneAndUpdate({ _id: req.params.id}, { 
                $set: { 
                    "paymentInformation.$[i].bankName": bankName && bankName,
                    "paymentInformation.$[i].bankAddress": bankAddress && bankAddress,
                    "paymentInformation.$[i].accountNumber": accountNumber && accountNumber,
                    "paymentInformation.$[i].sortCode": sortCode && sortCode,
                    "paymentInformation.$[i].TaxIndentificationNumber": TaxIndentificationNumber && TaxIndentificationNumber,
                }
           },
           { 
            arrayFilters: [
                {
                    "i._id": check.paymentInformation[0]._id
                }
            ]},
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
                            data: "Update Successful"
                        })
    
                    }
                })
        }

    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })
    }
}
export default addPayment;



