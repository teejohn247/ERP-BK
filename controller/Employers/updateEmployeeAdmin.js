
import dotenv from 'dotenv';
import Employee from '../../model/Employees';
import Roles from '../../model/Roles';
import AuditTrail from '../../model/AuditTrail';
import Company from '../../model/Company';
import utils from '../../config/utils';
import { emailTemp } from '../../emailTemplate';
import addDepartment from '../Department/addDepartment';
import Designation from "../../model/Designation";
import Department from "../../model/Department";



const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const updateEmployeeAdmin = async (req, res) => {

    try {
   
        // const { firstName, lastName, dateOfBirth, departmentId , companyRole, designationId, phoneNumber, gender,
        // employmentType} = req.body;

        const { firstName, lastName, email, phoneNumber, dateOfBirth, companyRole, gender, departmentId, companyRoleId, designationId,  employmentStartDate,
            employmentType } = req.body;

        let company = await Company.find({ _id: req.payload.id });
        console.log({company})

        if (!req.params.id) {
            res.status(400).json({
                status: 400,
                error: "Employee ID is required"
            });
            return;
        }


        const check = await Employee.findOne({ _id: req.params.id });
        // let checkRole = await Roles.findOne({_id: companyRoleId});
        if(designationId){
            var checkDesignation = await Designation.findOne({_id: designationId});

            if (!checkDesignation) {
                res.status(400).json({
                    status: 400,
                    error: "Designation doesn't exist"
                });
                return;
            }
        }
        if(departmentId){
           var checkDept = await Department.findOne({_id: departmentId});

           if (!checkDept) {
            res.status(400).json({
                status: 400,
                error: "Department doesn't exist"
            });
            return;
        }
        }
      
        if (!check) {
            res.status(400).json({
                status: 400,
                error: "Employee doesn't exist"
            });
            return;
        }

        console.log({checkDept})
        Employee.findOneAndUpdate({ _id: req.params.id}, { 
            $set: { 
                    firstName: firstName && firstName,
                    lastName: lastName && lastName,
                    dateOfBirth: dateOfBirth && dateOfBirth,
                    gender: gender && gender,
                    phoneNumber: phoneNumber && phoneNumber,
                    companyRole: companyRole && companyRole,
                    designationId: designationId && designationId,
                    designation: checkDesignation && checkDesignation.designationName,
                    department: checkDept && checkDept.departmentName,
                    departmentId: departmentId && departmentId,
                    employmentType: employmentType && employmentType,
                    managerId: checkDept && checkDept.managerId,
                    managerName: checkDept && checkDept.managerName,
                    profilePic: req.body.image
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
                  
                                    const updated = await Employee.findOneAndUpdate({ _id: req.params.id})
                
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
export default updateEmployeeAdmin;



