
import dotenv from 'dotenv';
import Employee from '../../model/Agent';
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



const updateAgent = async (req, res) => {

    try {
   
        // const { firstName, lastName, dateOfBirth, departmentId , companyRole, designationId, phoneNumber, gender,
        // employmentType} = req.body;

       
        
        const { firstName, lastName, email, phoneNumber, personalEmail, role, dateOfBirth, address,  gender, departmentId, designationId,  employmentStartDate,
            personalPhoneNumber, nationality,
            employmentType } = req.body;
    


        
            let company = await Company.find({ _id: req.payload.id });
            let checkUser = await Employee.findOne({companyId: req.payload.id, email: email });
    
    
    
            // let checkRole = await Roles.findOne({_id: companyRoleId})
            let checkDesignation = await Designation.findOne({_id: designationId})
    
            let checkDept= await Department.findOne({_id: departmentId})
            // let checkName= await Employee.findOne({_id: reportingTo })
    
            console.log({checkDept})
    
    
            if (!checkDept){
                return res.status(400).json({
                    status: 400,
                    error: 'Department does not exist'
                })
               
            }
    
            if (!company){
                return res.status(400).json({
                    status: 400,
                    error: `Company does not exist`
                })
               
            }
    
            if (!checkDesignation){
                return res.status(400).json({
                    status: 400,
                    error: `Designation does not exist`
                })
            }
    
        Employee.findOneAndUpdate({ _id: req.params.id}, { 
            $set: { 
                    firstName: firstName && firstName,
                    lastName: lastName && lastName,
                    gender: gender && gender,  
                    address: address && address,
                    email: email && email,
                    phoneNumber: phoneNumber && phoneNumber,
                    // profilePic: req.body.image && req.body.image,
                    dateOfBirth: dateOfBirth && dateOfBirth,
                    personalEmail: personalEmail && personalEmail,
                    personalPhoneNumber: personalPhoneNumber && personalPhoneNumber,
                    gender: gender && gender,
                    nationality: nationality && nationality,
                    phoneNumber: phoneNumber && phoneNumber,
                    fullName: `${firstName} ${lastName}` && `${firstName} ${lastName}`,
                    role: role && role,
                    designationName: checkDesignation.designationName && checkDesignation.designationName,
                    designationId: designationId && designationId,
                    departmentId: departmentId && departmentId,
                    department: checkDept.departmentName && checkDept.departmentName,
                    employmentType: employmentType && employmentType,
                    employmentStartDate: employmentStartDate && employmentStartDate,
                    managerId: checkDept.managerId && checkDept.managerId,
                    managerName: checkDept.managerName && checkDept.managerName,
                    email: email && email
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

                   
                    const checkUpdated = Employee.findOne({ _id: req.params.id })
                    AuditTrail.findOneAndUpdate({ companyId: company[0]._id},
                        { $push: { humanResources: { 
        
                            userName: checkUpdated.firstName && checkUpdated.lastName,
                            email: checkUpdated.email && checkUpdated.email,
                            action: `Super admin updated ${checkUpdated.firstName} ${checkUpdated.lastName} records`,
                            dateTime: new Date()

                         }}
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


                                    const updated = await Employee.findOne({ _id: req.params.id})
                
                                    res.status(200).json({
                                        status: 200,
                                        success: true,
                                        data: updated
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
export default updateAgent;



