
import dotenv from 'dotenv';
import Employee from '../../model/Employees';
import Roles from '../../model/Roles';
import AuditTrail from '../../model/AuditTrail';

import Company from '../../model/Company';

import utils from '../../config/utils';

import { emailTemp } from '../../emailTemplate';


const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const addPayment = async (req, res) => {

    try {
        console.log(req.payload.id)

        const { bankAddress, bankName, accountNumber, sortCode, accountName } = req.body;
        // let company = await Company.find({ _id: req.payload.id });


        const check = await Employee.findOne({ _id: req.payload.id })

        console.log({ check })



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
            Employee.findOneAndUpdate({ _id: req.payload.id },
                {
                    $push: {
                        paymentInformation: {

                            bankName: bankName && bankName,
                            bankAddress: bankAddress && bankAddress,
                            accountNumber: accountNumber && accountNumber,
                            sortCode: sortCode && sortCode,
                            accountName: accountName && accountName

                        }
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
                            data: "Update Successful"
                        })

                    }
                })
        } else {
            console.log('2kjds')

            Employee.findOneAndUpdate({ _id: req.payload.id }, {
                $set: {
                    "paymentInformation.$[i].bankName": bankName && bankName,
                    "paymentInformation.$[i].bankAddress": bankAddress && bankAddress,
                    "paymentInformation.$[i].accountNumber": accountNumber && accountNumber,
                    "paymentInformation.$[i].sortCode": sortCode && sortCode,
                    "paymentInformation.$[i].accountName && accountName":accountName && accountName,
                }
            },
                {
                    arrayFilters: [
                        {
                            "i._id": check.paymentInformation[0]._id
                        }
                    ]
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



                        // res.status(200).json({
                        //     status: 200,
                        //     success: true,
                        //     data: "Update Successful"
                        // })

                    }


                  
                })

                const checkUpdated = await Employee.findOne({ _id: req.payload.id })

                console.log(checkUpdated)
                console.log(checkUpdated.officialInformation[0].officialEmail)
                AuditTrail.findOneAndUpdate({ companyId: check.companyId },
                    {
                        $push: {
                            humanResources: {

                                userName: `${checkUpdated.personalInformation[0].firstName} ${checkUpdated.personalInformation[0].lastName}`,
                                email: checkUpdated.officialInformation[0].officialEmail,
                                action: `Super admin updated ${checkUpdated.personalInformation[0].firstName} ${checkUpdated.personalInformation[0].lastName} bank details`,
                                dateTime: new Date()
                            }
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



