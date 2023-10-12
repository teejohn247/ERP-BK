
import dotenv from 'dotenv';
import Employee from '../../model/Employees';
import Roles from '../../model/Roles';
import AuditTrail from '../../model/AuditTrail';
import Company from '../../model/Company';
import utils from '../../config/utils';
import { emailTemp } from '../../emailTemplate';

import Designation from "../../model/Designation";
import Department from "../../model/Department";

const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const updateEmployee = async (req, res) => {

    try {
   
        // const { firstName, lastName, dateOfBirth, departmentId , companyRole, designationId, phoneNumber, gender,
        // employmentType} = req.body;

        const { firstName, lastName, personalEmail, gender, phoneNumber, address, dateOfBirth,
             paymentInformation} = req.body;


             console.log({paymentInformation})
        

        const check = await Employee.findOne({ _id: req.payload.id });
     
        let company = await Company.find({ _id: check.companyId});

        if (!check) {
            res.status(400).json({
                status: 400,
                error: "Employee doesn't exist"
            });
            return;
        }
        Employee.findOneAndUpdate({ _id: req.params.id}, { 
            $set: { 

                    firstName: firstName && firstName,
                    lastName: lastName && lastName,
                    dateOfBirth: dateOfBirth && dateOfBirth,
                    gender: gender && gender,
                    address: address && address,
                    personalEmail: personalEmail && personalEmail,
                    phoneNumber: phoneNumber && phoneNumber,
            }
       },
            async function (
                err,
                result
            ) {
                if (err) {
                    res.status(401).json({
                        status: 401,
                        success: false,
                        error: err

                    })

                    return;

                } else {

                    await check.updateOne({
                        paymentInformation: paymentInformation && paymentInformation, 
                    });
                    const checkUpdated = Employee.findOne({ _id: req.params.id })
                    AuditTrail.findOneAndUpdate({ companyId: company[0]._id},
                        { $push: { humanResources: { 
        
                            userName: checkUpdated.firstName && checkUpdated.lastName,
                            email: checkUpdated.email && checkUpdated.email,
                            action: `Super admin updated ${checkUpdated.firstName} ${checkUpdated.lastName} records`,
                            dateTime: new Date()

                         }}
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
                                    return;
                
                                } else {
                
                
                                    res.status(200).json({
                                        status: 200,
                                        success: true,
                                        data: "Update Successful"
                                    })
                                    return;
                
                                }
                            })
                }
            })



    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })

        return;

    }
}
export default updateEmployee;



