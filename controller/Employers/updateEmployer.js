
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
   
        const { firstName, lastName, dateOfBirth, departmentId , companyRole, designationId, phoneNumber, gender,
        employmentType} = req.body;

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
                    gender: gender && gender,
                    phoneNumber: phoneNumber && phoneNumber,
                    companyRole: companyRole && companyRole,
                    // role: companyRoleId,
                    // roleName: checkRole.roleName,
                    designationId: designationId && designationId,
                    departmentId: departmentId && departmentId,
                    employmentType: employmentType && employmentType,
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

                    return;

                } else {
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



