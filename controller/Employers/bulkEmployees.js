
import dotenv from 'dotenv';
import Employee from '../../model/Employees';
import Roles from '../../model/Role';
import Company from '../../model/Company';
import Department from '../../model/Department';
import Designation from '../../model/Designation';
import AuditTrail from '../../model/AuditTrail';
import { sendEmail } from '../../config/email';





import utils from '../../config/utils';

import { emailTemp } from '../../emailTemplate';


const sgMail = require('@sendgrid/mail')
const csv = require('csvtojson');

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_KEY);

const bulkEmployee = async (req, res) => {

    try {

        // const { firstName, lastName, officialEmail, phoneNumber, dateOfBirth,  gender, departmentId, companyRoleId, designationId, dateOfJoining,
        // employmentType, reportingTo} = req.body;


        // let total = await Employee.find();


        // let checkRole = await Roles.findOne({_id: companyRoleId})
        // let checkDesignation = await Designation.findOne({_id: designationId})
        // let checkDept= await Department.findOne({_id: departmentId})
        // let checkName= await Employee.findOne({_id: reportingTo})



        // console.log(officialEmail)
        // console.log(checkName)


        // console.log(req.payload)

        // let company = await Company.find({ _id: req.payload.id });

        // const fileName = req.file.filename

        // console.log(fileName)






        // let ids = [];
        // let schoolData = [];


        // assigned_to.map((assign, index) => {
        //     ids.push(assign.school_id)
        // })

        // let all_schools = await School.find({ _id: { $in : ids }})

        // let check_sch = await School.find({ _id: { $in : ids }},
        //     { data_onboarding_template_assigned: { $elemMatch: { _id: template_id} } })

        //     if (check_sch.some((chk, i) => {
        //         chk.data_onboarding_template_assigned.length > 0
        //     })){
        //         res.status(400).json({
        //             status: 400,
        //             error: 'This Template has already been assigned to school'
        //         })
        //         return
        //     }

        //     all_schools.map((data, i) => {
        //         schoolData.push({school_id: data._id, school_name: data.schoolName, school_logo: data.schoolLogo})
        //     })



        let companyName = await Company.findOne({ _id: req.payload.id });

        let total = await Employee.find();

console.log(req.file.path)

        let emails = [];
        let departments = [];
        let designations = [];
        csv()
            .fromFile(req.file.path)
            .then(async (jsonObj) => {
            console.log(jsonObj)

            jsonObj.map((data, index) => {
                emails.push(data.email)
                departments.push(data.department)
                designations.push(data.designation)



                const d = new Date();
                let year = d.getFullYear();
                let letter = data.firstName.charAt(0);
                let last = data.lastName.charAt(0);
                data.companyName = companyName.companyName;
                data.companyId = req.payload.id;
                data.employeeCode = `EMP-${year}-${letter}${last}${total.length + 1}`;
                total = total + 1
                // receivers.push({email: data.officialEmail})
            })

            console.log(emails)

            const uniqueDepartments = [...new Set(departments)]
            const uniqueDesignations = [...new Set(designations)]

            console.log(uniqueDepartments);


            uniqueDesignations.map(async (data, index) => {
                const check = await Designation.findOne({companyId: req.payload.id, designationName: data});
                console.log({check})
    
                if(!check){
                    let designation = new Designation({
                        designationName: data,
                        companyId: req.payload.id,
                        companyName: companyName.companyName,
                        grade: 0
                    })
            
                    await designation.save().then(async (adm) => {
                
                 console.log(adm)
                     
                    }).catch((err) => {
                            console.error(err)
                            res.status(400).json({
                                status: 400,
                                success: false,
                                error: err
                            })
                        })
    
                }
            })

            uniqueDepartments.map(async (data, index) => {
            const check = await Department.findOne({companyId: req.payload.id, departmentName: data});

            console.log({check})

            if(!check){
                let department = new Department({
                    departmentName: data,
                    companyId: req.payload.id,
                    companyName: companyName.companyName
                })
        
                await department.save().then(async (adm) => {

            
             console.log(adm)
                 
                }).catch((err) => {
                        console.error(err)
                        res.status(400).json({
                            status: 400,
                            success: false,
                            error: err
                        })
                    })

            }

            let checkCompany = await Employee.find(
                {   companyId: req.payload.id,
                    email: { $in: emails }},
                
              );
            
    
              console.log({checkCompany})
            
                    var comp= false
    
                    if (checkCompany.length > 0){
                        checkCompany.some((chk, i) => {
                            console.log({chk})
                            comp = true
                            // if(chk.officialInformation.length > 0){
                            //     comp = true
                             
                            // }
                        })
                    }

            
                    if(comp == true){
                         res.status(400).json({
                            status: 400,
                            error: `An employee already exist with email: ${checkCompany[0].email}`
                        })

                        return;
                    }
    
            
                Employee.insertMany(jsonObj, async function(err){
                    if (err){
                    console.log(err);
    
                    res.status(400).json({
                        status: 400,
                        success: false,
                        message: err.writeErrors[0].err.errmsg
                    })
                    return;
    
                    } else {
    
                    console.log("Succesfully saved");
    
    
                    emails.map(async(mail, index) => {
                        const token = utils.encodeToken("", false, mail);
                        const receivers= [{
                            email: mail
                        }]
    
                        let data = `<div>
                        <p style="padding: 32px 0; text-align:left !important;  font-weight: 700; font-size: 20px;font-family: 'DM Sans';">
                        Hi,
                        </p> 
    
                        <p style="font-size: 16px; text-align:left !important; font-weight: 300;">
    
                        You have been invited to join <a href="https://xped8-ca9291a9a7e0.herokuapp.com/set-password/${token}">SILO ERP Platform</a> as an employee 
    
                        <br><br>
                        </p>
                        
                        <div>`
    
                        let resp = emailTemp(data, 'Employee Invitation')
                        await sendEmail(req, res, mail, receivers, 'Employee Invitation', resp);
                        
                    })
                    res.status(200).json({
                        status: 200,
                        success: true,
                        message: "Upload Successful"
                    })
                    return;
                    }
                });
                
            })




        });

    //     let checkCompany = await Employee.find({ companyId: req.payload.id },
    //         { officialInformation: { $elemMatch: { officialEmail:  officialEmail} } })

    //         var comp= false

    //     if (checkCompany.length > 0){
    //         checkCompany.some((chk, i) => {
    //             console.log({chk})
    //             if(chk.officialInformation.length > 0){
    //                 comp = true
                 
    //             }
    //         })
    //     }

    //     if(comp == true){
    //         return res.status(400).json({
    //             status: 400,
    //             error: `An employee already exist with email: ${officialEmail}`
    //         })
    //     }


    //     const d = new Date();
    //     let year = d.getFullYear();
    //     // var timeNow = (new Date()).getTime().toString();
     
    //     console.log('hgh')


    //     let letter = firstName.charAt(0);
    //     let last = lastName.charAt(0);
    //     console.log('hgh')

    // console.log('ff', company[0].companyName)

    //    let employee = new Employee({
    //         companyName: company[0].companyName,
    //         companyId: req.payload.id,
    //             firstName,
    //             lastName,
    //             dateOfBirth,
    //             gender,
    //             phoneNumber,
    //             employeeCode: `EMP-${year}-${letter}${last}${total.length + 1}`,
    //             role: companyRoleId,
    //             roleName: checkRole.roleName,
    //             designationName: checkDesignation.designationName,
    //             designationId,
    //             departmentId: departmentId,
    //             departmentName: checkDept.departmentName,
    //             employmentType,
    //             dateOfJoining,
    //             reportingToId: reportingTo,
    //             reportingToName: `${checkName.firstName} ${checkName.lastName}` ,
    //             officialEmail,
    //             leave: checkRole.leaveType,
    //             hmo: checkRole.hmoPackages
          
    //     })




    //    let resp = emailTemp(data, 'Nigenius SMS Admin Invitation')

    //     const msg = {
    //         to: email, // Change to your recipient
    //         subject: 'Nigenius SMS Admin Invitation',
    //         html: `${resp}`,
    //         from: {
    //             email:'smsnebula@nigenius.ng',
    //             name: "Nigenius SMS"
    //         }
    //     }



        // await employee.save().then((adm) => {

        //     AuditTrail.findOneAndUpdate({ companyId: company[0]._id}, 
        //         { $push: { humanResources: { 

        //             userName: `${firstName} ${lastName}`,
        //             email: `${officialEmail}`,
        //             action: `Super admin invited ${firstName} ${lastName} as an employee`,
        //             dateTime: new Date()
        //          }}
        //        },
        //             function (
        //                 err,
        //                 result
        //             ) {
        //                 if (err) {
        //                     res.status(401).json({
        //                         status: 401,
        //                         success: false,
        //                         error: err
        
        //                     })
        
        //                 } else {
        
        //                     sgMail.send(msg)
        //                     console.log('Email sent')
        //                     console.log(adm)
        //                         res.status(200).json({
        //                             status: 200,
        //                             success: true,
        //                             data: "Employee has been invited successfully"
        //                         })
        //                 }
        //             })

        //     // sgMail.send(msg)
          
        // }).catch((err) => {
        //         console.error(err)
        //         res.status(400).json({
        //             status: 400,
        //             success: false,
        //             error: err
        //         })
        //     })
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })
    }
}
export default bulkEmployee;



