
import dotenv from 'dotenv';
import Employee from '../../model/Employees';
import Roles from '../../model/Roles';


import utils from '../../config/utils';

import { emailTemp } from '../../emailTemplate';


const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const inviteEmployee = async (req, res) => {

    try {

        const { firstName, lastName, dateOfBirth, personalEmail, phoneNumber, companyEmail, gender,
        employmentType, role, department} = req.body;


        if (!companyEmail) {
            res.status(400).json({
                status: 400,
                error: 'Email Address is required'
            })
            return;
        }


        let employee = await Employee.findOne({ companyEmail });

        let total = await Employee.find();
        console.log('hgh')


        if (employee) {

            res.status(400).json({
                status: 400,
                error: 'This employee already exist'
            })
            return;
        }

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

        employee = new Employee({
            firstName, 
            lastName, 
            dateOfBirth, 
            personalEmail, 
            phoneNumber, 
            companyEmail, 
            gender,
            employmentType, 
            role, 
            employeeCode: `EMP-${year}-${letter}${last}${total.length + 1}`, 
            department
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



