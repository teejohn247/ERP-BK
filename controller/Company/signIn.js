import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import Admin from '../../model/Company';
import Employee from '../../model/Employees';

import utils from '../../config/utils';
import Company from '../../model/Company';

const sgMail = require('@sendgrid/mail')



sgMail.setApiKey(process.env.SENDGRID_KEY);


dotenv.config();

const signin = async (req, res) => {

    try {
        const { email, password } = req.body;


        // let useragent = req.useragent;
        // let detectResult = req.device;

        // let admin = await Admin.findOne({ email: email });

        // console.log(admin)

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

        let admin = await Admin.findOne({ email: email });
        let employee = await Employee.findOne({ email: email });
        console.log({employee})
        console.log(admin)

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
            console.log("here")
                
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

            const token = utils.encodeToken(admin._id, admin.isSuperAdmin, admin.email);

            res.status(200).json({
                status: 200,
                data: company,
                token: token,
            })

            return;
        } else if(employee){
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
            console.log("here")
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

            let company = await Employee.findOne({ email: email });

            console.log({employee})

            const token = utils.encodeToken(employee._id, false, employee.email);

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
        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })
    }
}

export default signin;
