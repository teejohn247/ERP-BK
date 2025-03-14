import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import Admin from '../../model/Company';
import Employee from '../../model/Employees';
import AceERP from '../../model/Silo';

import utils from '../../config/utils';
import Company from '../../model/Company';
import path from 'path';
import { selectFields } from 'express-validator/src/select-fields';

const sgMail = require('@sendgrid/mail')



sgMail.setApiKey(process.env.SENDGRID_KEY);


dotenv.config();

const signin = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email) {
            res.status(400).json({
                status: 400,
                success: false,
                errorMessage: 'Please enter a valid email'
            })
            return;
        }

        if (!password) {
            res.status(400).json({
                status: 400,
                success: false,
                errorMessage: 'Please password field is required'
            })
            return;
        }

        if (email == 'siloerp@silo-inc.com') {
            let superAdmin = await AceERP.findOne({ email: email });

            console.log({superAdmin})
            
            if (!superAdmin) {
                res.status(404).json({
                    status: 404,
                    success: false,
                    error: 'Super admin not found'
                });
                return;
            }

            const isMatch = await bcrypt.compare(password, superAdmin.password);
            if (!isMatch) {
                res.status(404).json({
                    status: 404,
                    success: false,
                    error: 'Invalid login credentials'
                });
                return;
            }

            const token = utils.encodeToken(superAdmin._id, true, superAdmin.email, "");

            res.status(200).json({
                status: 200,
                data: superAdmin,
                token: token,
            });
            return;
        }

        let admin = await Admin.findOne({ email: email });
        let employee = await Employee.findOne({ email: email });

        console.log({admin, employee})

        if(admin && employee){
                res.status(400).json({
                    status: 400,
                    success: false,
                    error: 'This email already exist either as a company email or employee email'
                })
                return;
            
         } 

        if (admin){
            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) {
                res.status(404).json({
                    status: 404,
                    success: false,
                    error: 'Invalid login credentials'
                })
                return;
            }
            console.log(admin.firstTimeLogin)


            if (admin.firstTimeLogin == undefined) {
                await admin.updateOne({

                    firstTimeLogin: true, 
                
                });
            }else if (admin.firstTimeLogin == true){
                await admin.updateOne({
                    firstTimeLogin: false, 
                });

            }
            else if (admin.firstTimeLogin == false){
                await admin.updateOne({
                    firstTimeLogin: false, 
                });
            }

            let company = await Admin.findOne({ email: email });

            console.log({admin})

            const token = utils.encodeToken(admin._id, admin.isSuperAdmin, admin.email, "");

            // const companyDomain = `https://${company.subDomain}`;

            // if (companyDomain !== req.headers.origin) {
            //     return res.status(400).json({
            //         status: 400,
            //         error: `Invalid subdomain. Please login with the correct subdomain https://${company.subDomain}`
            //     })
            // }

            res.status(200).json({
                status: 200,
                data: company,
                token: token,
            })

            return;
        } else if(employee){
            if(!employee.password){
                res.status(400).json({
                    status: 400,
                    success: false,
                    error: 'Password not set'
                })
                return;
            }
            const isMatch = await bcrypt.compare(password, employee.password);

            console.log({isMatch})
            if (!isMatch) {
                res.status(404).json({
                    status: 404,
                    success: false,
                    error: 'Invalid login credentials'
                })
                return;
            }
            console.log(employee.firstTimeLogin)


            if (employee.firstTimeLogin == undefined) {
        
                await employee.updateOne({
                    firstTimeLogin: true, 
                });
            }else if (employee.firstTimeLogin == true){
                await employee.updateOne({
                    firstTimeLogin: false, 
                });

            }
            else if (employee.firstTimeLogin == false){
                await employee.updateOne({
                    firstTimeLogin: false, 
                });
            }

            let company = await Employee.findOne({ email: email }).populate({
                path: 'companyId',
                select: 'subDomain'
            });

            const token = utils.encodeToken(employee._id, false, email, employee.companyId);

            //compare the company subdomain url with the url is the same
            // if not the same, return error

            
            // const companyDomain = `https://${company.companyId.subDomain}`;

            // if (companyDomain !== req.headers.origin) {
            //     return res.status(400).json({
            //         status: 400,
            //         error: `Invalid subdomain. Please login with the correct subdomain https://${company.companyId.subDomain}`
            //     })
            // }

            res.status(200).json({
                status: 200,
                data: company,
                token: token,
            })

            return

         }  else {

                res.status(400).json({
                    status: 400,
                    error: `User with email: ${email} does not exist`
                })
                return;
         }
      
        } catch (error) {
            console.error(error)
        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })
    }
}

export default signin;
