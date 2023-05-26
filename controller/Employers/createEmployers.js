
import dotenv from 'dotenv';
import Employee from '../../model/Employees';
import Roles from '../../model/Role';
import Company from '../../model/Company';



import utils from '../../config/utils';

import { emailTemp } from '../../emailTemplate';


const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const inviteEmployee = async (req, res) => {

    try {

        const { firstName, lastName, dateOfBirth, personalEmail, phoneNumber, nextOfKinFullName, nextOfKinAddress, nextOfKinPhoneNumber, nextOfKinGender, companyEmail, gender,
        employmentType, roleId, department, companyAddress, manager, companyBranch} = req.body;


        

        // let employee = await Employee.findOne({ "officialInformation.companyEmail": companyEmail });

        let total = await Employee.find();


        // if (employee) {

        //     res.status(400).json({
        //         status: 400,
        //         error: 'An employee with this email address already exist'
        //     })
        //     return;
        // }
        let checkRole = await Roles.findOne({_id: roleId})
        console.log( personalEmail, companyEmail)

       

        let company = await Company.find({ _id: req.payload.id });

        let pp= await Employee.findOne({ companyId: req.payload.id })
        console.log({pp})

        var personal = false

        let checkPersonal = await Employee.find({ companyId: req.payload.id  },
            { personalInformation: { $elemMatch: { personalEmail:  personalEmail} } })
            console.log(checkPersonal.length)

            if (checkPersonal.length > 0){
                checkPersonal.some((chk, i) => {
                    console.log(chk.personalInformation.length)
                    if(chk.personalInformation.length > 0){
                        console.log(personal)
                       personal = true
                    }
                })
            
        }
        console.log('kk')

        if(personal == true){
            return res.status(400).json({
                status: 400,
                error: `An employee already exist with email: ${personalEmail}`
            })
        }


        let checkCompany = await Employee.find({ companyId: req.payload.id  },
            { officialInformation: { $elemMatch: { companyEmail:  companyEmail} } })

            var comp= false


        //     if (checkPersonal.length > 0){
        //         checkPersonal.some((chk, i) => {
        //             console.log({chk})
        //             if(chk.personalInformation.length > 0){
        //                 personal== true
                     
        //             }
        //         })
        // }
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
                error: `An employee already exist with email: ${companyEmail}`
            })
        }

            if (checkPersonal.length > 0 && checkPersonal.some((chk, i) => {
                chk.personalInformation.length > 0
            })){
                console.log({chk})
                res.status(400).json({
                    status: 400,
                    error: `An employee already exist with email: ${personalEmail}}`
                })
                return
            }


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

       let employee = new Employee({
            companyName: company[0].companyName,
            companyId: req.payload.id,
            personalInformation:[{
                firstName,
                lastName,
                dateOfBirth,
                personalEmail,
                gender,
                phoneNumber,
                nextOfKinAddress,
                nextOfKinFullName,
                nextOfKinPhoneNumber,
                nextOfKinGender,

            }],
            officialInformation:[{
                employeeCode: `EMP-${year}-${letter}${last}${total.length + 1}`,
                role: roleId,
                roleName: checkRole.roleName,
                department: department,
                employmentType,
                companyBranch,
                companyAddress,
                manager,
                companyEmail,
                leave: checkRole.leaveType,
                hmo: checkRole.hmoPackages
            }],
        })


        await employee.save().then((adm) => {

            // sgMail.send(msg)
            console.log(adm)
            res.status(200).json({
                status: 200,
                success: true,
                data: "Employee has been invited successfully"
            })
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



