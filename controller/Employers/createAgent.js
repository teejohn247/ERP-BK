
import dotenv from 'dotenv';
import Employee from '../../model/Agent';
import Roles from '../../model/Role';
import Company from '../../model/Company';
import Department from '../../model/Department';
import Designation from '../../model/Designation';
import AuditTrail from '../../model/AuditTrail';
import { sendEmail } from '../../config/email';




import utils from '../../config/utils';

import { emailTemp } from '../../emailTemplate';
import { date } from 'joi';
import moment from 'moment/moment';


const sgMail = require('@sendgrid/mail')

dotenv.config();


const createAgent = async (req, res) => {

    try {

        // const { firstName, lastName, email, phoneNumber, gender, address} = req.body;

        const { firstName, lastName, email, phoneNumber, role, dateOfBirth, address, companyRole,  gender, departmentId, companyRoleId, designationId,  employmentStartDate,
            employmentType, reportingTo} = req.body;
    

        let company = await Company.find({ _id: req.payload.id });
        let checkUser = await Employee.findOne({companyId: req.payload.id, email: email });

        console.log(checkUser);


        // let checkRole = await Roles.findOne({_id: companyRoleId})
        let checkDesignation = await Designation.findOne({_id: designationId})
        console.log({checkDesignation});

        let checkDept= await Department.findOne({_id: departmentId})
        // let checkName= await Employee.findOne({_id: reportingTo })
        console.log({checkDept});



        console.log(checkUser);

        // const check = await Employee.findOne({ _id: managerId });

        if (checkUser){
            return res.status(400).json({
                status: 400,
                error: 'Email already exist'
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


        // const check = await Employee.findOne({ _id: managerId });
        


        console.log(company)


            let checkCompany = await Employee.find(
                {   companyId: req.payload.id,
                    email: email},
                
              );

            console.log(checkCompany.length)
            console.log({checkCompany})
            var comp= false

        if (checkCompany.length > 0){
            console.log(checkCompany.length)


            checkCompany.some((chk, i) => {
                console.log({chk})
                // if(chk.officialInformation.length > 0){
                    comp = true
                // }
            })
        }

        if(comp == true){
            return res.status(400).json({
                status: 400,
                error: `An agent already exist with email: ${email}`
            })
        }

        console.log('heer',{
        // companyName: company[0].companyName,
        // companyId: req.payload.id,
            firstName,
            // lastName,
            // address,
            // gender,
            // phoneNumber,
            // fullName: `${firstName} ${lastName}`,
            email
        })


      new Employee({
            companyName: company[0].companyName,
            companyId: req.payload.id,
            firstName,
            lastName,
            dateOfBirth,
            gender,
            phoneNumber,
            fullName: `${firstName} ${lastName}`,
            role,
            designationName: checkDesignation.designationName,
            designationId,
            departmentId: departmentId,
            department: checkDept.departmentName,
            employmentType,
            employmentStartDate,
            managerId:  checkDept.managerId && checkDept.managerId,
            managerName: checkDept.managerName && checkDept.managerName,
            email,
        }).save().then(async(adm) => {

            console.log({adm})


            AuditTrail.findOneAndUpdate({ companyId: company[0]._id}, 
                { $push: { humanResources: { 

                    userName: `${firstName} ${lastName}`,
                    email: `${email}`,
                    action: `Super admin invited ${firstName} ${lastName} as an employee`,
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
        
                        } else {

                            console.log({result})

                       let checkUsers = await Employee.findOne({companyId: req.payload.id, email });

        
                                res.status(200).json({
                                    status: 200,
                                    success: true,
                                    data:checkUsers
                                })
                        }
                    })
       
        }).catch((err) => {
                console.error(err)
               return res.status(400).json({
                    status: 400,
                    success: false,
                    error: err
                })
            })

   
        // await employee.save().then((adm) => {

          
                // });
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })
    }
}
export default createAgent ;



