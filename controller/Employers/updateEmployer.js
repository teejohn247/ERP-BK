
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



const updateEmployee = async (req, res) => {

    try {
   
        const { firstName, lastName, dateOfBirth, personalEmail, phoneNumber, companyEmail, gender,
        employmentType, role, department, companyAddress, companyBranch, nextOfKinFullName, nextOfKinPhoneNumber, nextOfKinGender,
        nextOfKinAddress, paymentInformation} = req.body;

        const check = await Employee.findOne({ _id: req.params.id })
        let company = await Company.find({ _id: req.payload.id });


        if (!check) {
            res.status(400).json({
                status: 400,
                error: "Employee doesn't exist"
            })
            return;
        }
    

        Employee.findOneAndUpdate({ _id: req.params.id}, { 
            $set: { 
                firstName: firstName && firstName,
                lastName: lastName && lastName,
                dateOfBirth: dateOfBirth && dateOfBirth,
                personalEmail: personalEmail && personalEmail,
                phoneNumber: phoneNumber && phoneNumber,
                companyEmail: companyEmail && companyEmail,
                gender: gender && gender,
                employmentType: employmentType && employmentType,
                role: role && role,
                department: department && department,
                companyAddress: companyAddress && companyAddress,
                companyBranch: companyBranch && companyBranch,
                nextOfKinAddress: nextOfKinAddress && nextOfKinAddress,
                nextOfKinFullName: nextOfKinFullName && nextOfKinFullName,
                nextOfKinPhoneNumber: nextOfKinPhoneNumber && nextOfKinPhoneNumber,
                mextOfkinGender: nextOfKinGender && nextOfKinGender,
                paymentInformation: paymentInformation && paymentInformation
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
                    const checkUpdated = Employee.findOne({ _id: req.params.id })
                    AuditTrail.findOneAndUpdate({ companyId: company[0]._id},
                        { $push: { humanResources: { 
        
                            userName: checkUpdated.personalInformation[0].firstName && checkUpdated.personalInformation[0].perlastName,
                            userEmail: checkUpdated.officiallInformation[0].officialEmail && checkUpdated.officialInformation[0].officialEmail,
                            action: `Super admin updated ${checkUpdated.personalInformation[0].firstName} ${checkUpdated.personalInformation[0].lastName} records`,
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
                
                                } else {
                
                
                                    res.status(200).json({
                                        status: 200,
                                        success: true,
                                        data: "Update Successful"
                                    })
                
                                }
                            })


                    res.status(200).json({
                        status: 200,
                        success: true,
                        data: "Update Successful"
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
export default updateEmployee;



