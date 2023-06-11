
import dotenv from 'dotenv';
import Employee from '../../model/Employees';
import Roles from '../../model/Role';
import Company from '../../model/Company';
import Department from '../../model/Department';
import Designation from '../../model/Designation';
import AuditTrail from '../../model/AuditTrail';





import utils from '../../config/utils';

import { emailTemp } from '../../emailTemplate';


const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const inviteEmployee = async (req, res) => {

    try {

        const { firstName, lastName, officialEmail, phoneNumber, dateOfBirth,  gender, departmentId, companyRoleId, designationId, dateOfJoining,
        employmentType, reportingTo} = req.body;


        // const { firstName, lastName, dateOfBirth, personalEmail, phoneNumber, nextOfKinFullName, nextOfKinAddress, nextOfKinPhoneNumber, nextOfKinGender, companyEmail, gender,
        //     employmentType, roleId, department, companyAddress, manager, companyBranch} = req.body;

        // let employee = await Employee.findOne({ "officialInformation.companyEmail": companyEmail });

        let total = await Employee.find();


        // if (employee) {

        //     res.status(400).json({
        //         status: 400,
        //         error: 'An employee with this email address already exist'
        //     })
        //     return;
        // }
        let checkRole = await Roles.findOne({_id: companyRoleId})
        let checkDesignation = await Designation.findOne({_id: designationId})
        let checkDept= await Department.findOne({_id: departmentId})
        let checkName= await Employee.findOne({_id: reportingTo})



        console.log(officialEmail)
        console.log(checkName)


       console.log(req.payload)

        let company = await Company.find({ _id: req.payload.id });

        console.log({company})

        // let pp= await Employee.findOne({ companyId: req.payload.id })
        // console.log({pp})

        // var personal = false

        // let checkPersonal = await Employee.find({ companyId: req.payload.id  },
        //     { officialInformation: { $elemMatch: { officialEmail: officialEmail} } })
        //     console.log(checkPersonal.length)

        //     if (checkPersonal.length > 0){
        //         checkPersonal.some((chk, i) => {
        //             console.log(chk.personalInformation.length)
        //             if(chk.personalInformation.length > 0){
        //                 console.log(personal)
        //                personal = true
        //             }
        //         })
            
        // }
        // console.log('kk')

        // if(personal == true){
        //     return res.status(400).json({
        //         status: 400,
        //         error: `An employee already exist with email: ${personalEmail}`
        //     })
        // }


        let checkCompany = await Employee.find({ companyId: req.payload.id },
            { officialInformation: { $elemMatch: { officialEmail:  officialEmail} } })

            var comp= false

        if (checkCompany.length > 0){
            checkCompany.some((chk, i) => {
                console.log({chk})
                if(chk.officialInformation.length > 0){
                    comp = true
                 
                }
            })
        }

        if(comp == true){
            return res.status(400).json({
                status: 400,
                error: `An employee already exist with email: ${officialEmail}`
            })
        }

            // if (checkPersonal.length > 0 && checkPersonal.some((chk, i) => {
            //     chk.personalInformation.length > 0
            // })){
            //     console.log({chk})
            //     res.status(400).json({
            //         status: 400,
            //         error: `An employee already exist with email: ${officialEmail}}`
            //     })
            //     return
            // }


        // if (checkPersonal.personalInformation.length > 0 && checkCompany.officialInformation.length > 0) {
        //     res.status(400).json({
        //         status: 400,
        //         error: 'An employee with this email address already exist'
        //     })
        //     return;
        // }

        const d = new Date();
        let year = d.getFullYear();
        // var timeNow = (new Date()).getTime().toString();
     
        console.log('hgh')


        let letter = firstName.charAt(0);
        let last = lastName.charAt(0);
        console.log('hgh')


    //     const token = utils.encodeToken("", false, companyEmail);

    //     let data = `<div>
    //     <p style="padding: 32px 0; font-weight: 700; font-size: 20px;font-family: 'DM Sans';">
    //     Hi Admin,
    //     </p> 

    //     <p style="font-size: 16px;font-weight: 300;">

    //     You have been invited to join <a href="#">Xped8</a> as ${role == "Admin" ? `an ${role}` : `a ${role}`} 

    //     <br><br>
    //     </p>
        
    //     <div>`

    //    let resp = emailTemp(data, 'Xped8 Platform Invitation')

    //     const msg = {
    //         to: email, // Change to your recipient
    //         from: 'smsnebula@nigenius.ng',
    //         subject: 'Xped8 Platform Invitation',
    //         // text: 'This is a test email',
    //         html: `${resp}`,
    //     }
    console.log('ff', company[0].companyName)

       let employee = new Employee({
            companyName: company[0].companyName,
            companyId: req.payload.id,
            personalInformation:[{
                firstName,
                lastName,
                dateOfBirth,
                gender,
                phoneNumber,
            }],
            officialInformation:[{
                employeeCode: `EMP-${year}-${letter}${last}${total.length + 1}`,
                role: companyRoleId,
                roleName: checkRole.roleName,
                designationName: checkDesignation.designationName,
                designationId,
                departmentId: departmentId,
                departmentName: checkDept.departmentName,
                employmentType,
                dateOfJoining,
                reportingToId: reportingTo,
                reportingToName: `${checkName.firstName} ${checkName.lastName}` ,
                officialEmail,
                leave: checkRole.leaveType,
                hmo: checkRole.hmoPackages
            }],
        })


        await employee.save().then((adm) => {

            AuditTrail.findOneAndUpdate({ companyId: company[0]._id}, 
                { $push: { humanResources: { 

                    userName: `${firstName} ${lastName}`,
                    userEmail: `${officialEmail}`,
                    action: `Super admin invited ${firstName} ${lastName} as an employee`,
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
        
        
                            console.log(adm)
                                res.status(200).json({
                                    status: 200,
                                    success: true,
                                    data: "Employee has been invited successfully"
                                })
                        }
                    })

            // sgMail.send(msg)
          
        }).catch((err) => {
                console.error(err)
                res.status(400).json({
                    status: 400,
                    success: false,
                    error: err
                })
            })
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })
    }
}
export default inviteEmployee;



