
import dotenv from 'dotenv';
import Employee from '../../model/Employees';
import Roles from '../../model/Role';
import Company from '../../model/Company';
import Department from '../../model/Department';
import Designation from '../../model/Designation';
import AuditTrail from '../../model/AuditTrail';
import { sendEmail } from '../../config/email';

import moment from 'moment/moment';




import utils from '../../config/utils';

import { emailTemp } from '../../emailTemplate';


const sgMail = require('@sendgrid/mail')
const csv = require('csvtojson');


dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_KEY);

const bulkEmployee = async (req, res) => {

    try {
        let companyName = await Company.findOne({ _id: req.payload.id });

        console.log({ companyName });
        
        if (!companyName) {
            res.status(400).json({
                status: 400,
                success: false,
                error: 'Unauthorized, only an admin can upload employees'
            });
        
            return;
        }
        
        let total = await Employee.find();
        
        console.log(req.file.path);
        
        let emails = [];
        let departments = [];
        let designations = [];
        
        try {
            const jsonObj = await csv().fromFile(req.file.path);
        
            for (const data of jsonObj) {
                emails.push(data.email);
                departments.push(data.department);
                designations.push(data.designation);
        
                let checkDesignation = await Designation.findOne({ companyId: req.payload.id, designationName: data.designation });
                console.log('de', checkDesignation);
        
                const checkDept = await Department.findOne({ companyId: req.payload.id, departmentName: data.department });
        
                const approver = [
                    {
                        approvalType: 'leave',
                        approval: checkDept.managerName,
                        approvalId: checkDept.managerId
                    },
                    {
                        approvalType: 'expense',
                        approval: checkDept.managerName,
                        approvalId: checkDept.managerId
                    },
                    {
                        approvalType: 'appraisal',
                        approval: checkDept.managerName,
                        approvalId: checkDept.managerId
                    },
                ];
        
                const d = new Date();
                let year = d.getFullYear();
                let letter = data.firstName.charAt(0);
                let last = data.lastName.charAt(0);
                data.companyName = companyName.companyName;
                data.companyId = req.payload.id;
                data.employeeCode = `EMP-${year}-${letter}${last}${total.length + 1}`;
                data.approvals = approver;
                data.expenseDetails = {
                    cardNo: Date.now(),
                    cardHolder: `${data.firstName} ${data.lastName}`,
                    dateIssued: new Date().toISOString(),
                    cardBalance: checkDesignation?.expenseCard[0]?.cardLimit ? checkDesignation.expenseCard[0].cardLimit : 0,
                    cardLimit: checkDesignation?.expenseCard[0]?.cardLimit ? checkDesignation.expenseCard[0].cardLimit : 0,
                    cardCurrency: checkDesignation?.expenseCard[0]?.cardCurrency ? checkDesignation.expenseCard[0].cardCurrency : "",
                    cardLExpiryDate: checkDesignation?.expenseCard[0]?.cardExpiryDate ? checkDesignation.expenseCard[0].cardExpiryDate : "",
                    expenseTypeId: checkDesignation?.expenseCard[0]?.expenseTypeId ? checkDesignation.expenseCard[0].expenseTypeId : "",
                };
                total = total + 1;
            }
        
            const uniqueDepartments = [...new Set(departments)];
            const uniqueDesignations = [...new Set(designations)];
        
            console.log(uniqueDepartments);
        
            uniqueDesignations.map(async (data, index) => {
                const check = await Designation.findOne({ companyId: req.payload.id, designationName: data });
                console.log({ check }, 'logo2')
        
                if (!check) {
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
                const check = await Department.findOne({ companyId: req.payload.id, departmentName: data });
        
                console.log({ check })
        
                if (!check) {
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
                    {
                        companyId: req.payload.id,
                        email: { $in: emails }
                    },
        
                );
        
        
                console.log({ checkCompany })
                console.log(req.payload)
        
        
                var comp = false
        
                if (checkCompany.length > 0) {
                    checkCompany.some((chk, i) => {
                        console.log({ chk })
                        comp = true
                    })
                }
        
        
                if (comp == true) {
                    res.status(400).json({
                        status: 400,
                        error: `An employee already exist with email: ${checkCompany[0].email}`
                    })
        
                    return;
                }
        
                Employee.insertMany(jsonObj, async function (err) {
                    if (err) {
                        console.log(err);
        
                        res.status(400).json({
                            status: 400,
                            success: false,
                            message: err
                        })
                        return;
        
                    } else {
        
                        console.log("Successfully saved");
        
                        emails.map(async (mail, index) => {
                            const token = utils.encodeToken("", false, mail);
                            const receivers = [{
                                email: mail
                            }]
        
                            let data = `<div>
                                <p style="padding: 32px 0; text-align:left !important;  font-weight: 700; font-size: 20px;font-family: 'DM Sans';">
                                Hi,
                                </p> 
        
                                <p style="font-size: 16px; text-align:left !important; font-weight: 300;">
        
                                You have been invited to join <a href="https://xped8-ca9291a9a7e0.herokuapp.com/set-password/${token}">Greenpeg ERP Platform</a> as an employee 
        
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
        
        } catch (err) {
            console.error(err);
            res.status(400).json({
                status: 400,
                success: false,
                error: err
            });
        }
        


    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })
    }
}
export default bulkEmployee;



