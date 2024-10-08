
import dotenv from 'dotenv';
import Company from '../../model/Employees';
import Admin from '../../model/Company';

import bcrypt from 'bcrypt';
import HTTP_STATUS from 'http-status-codes';
import jwt_decode from 'jwt-decode';
import AppraisalGroup from '../../model/AppraisalGroup';
import utils from '../../config/utils';
import Employee from '../../model/Employees';

const sgMail = require('@sendgrid/mail')
dotenv.config();



sgMail.setApiKey(process.env.SENDGRID_KEY);



const verifyEmployee = async (req, res) => {

    try {
       
        const {password} = req.body;

        console.log(req.decode.email)

        let emp = await Company.findOne({ email: req.decode.email });
        let adm = await Admin.findOne({ email: req.decode.email });

   console.log(emp)
   console.log(adm)


        if(emp){



            if(password.length < 1){
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    status: HTTP_STATUS.BAD_REQUEST,
                    error: 'empty password'
                });
        
                return;
             }
    
            if(!emp){
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    status: HTTP_STATUS.BAD_REQUEST,
                    error: 'wrong token'
                });
        
                return;
             }
        
           
    
                let employee = await Company.findOne({ email: req.decode.email });
    
                console.log({employee})
    
                if (!employee) {
        
                    res.status(400).json({
                        status: 400,
                        error: `User with email: ${req.decode.email} does not exist`
                    })
                    return;
                }
                const salt = await bcrypt.genSalt(10);
                const hashed = await bcrypt.hash(password, salt);
        
                console.log(salt, hashed)
                await employee.updateOne({
    
                    password: password && hashed,
                    activeStatus: true
                
                });
        
                await employee.save();
    
    
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
    
        
                    const token = utils.encodeToken(employee._id, false, employee.email);
                    console.log("here")

                    const appraisals = await AppraisalGroup.findOne({companyId:employee.companyId, groupName : "General"}, {_id: 1, groupName:1, groupKpis: 1, description: 1})
                    AppraisalGroup.findOneAndUpdate({companyId:employee.companyId, groupName : "General"}, { 
                        $push: { assignedEmployees:
                            {employee_id: employee._id,
                            employee_name: employee.fullName}
                        },
                   },{ upsert: true },
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

                                console.log({appraisals})
            
                                Employee.findOneAndUpdate({ _id: employee._id }, { 
                                    $push: {  appraisals },
    
                               },{ upsert: true },
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
    
    
                        
                                        }
                                    })
            
            
                            }
                        })

                        let registered = await Company.findOne({ email: req.decode.email });

        
                    res.status(200).json({
                        status: 200,
                        data: registered,
                        token: token,
                    })
                return;

        } else if (adm){
            let admin = await Admin.findOne({ email: req.decode.email });


            if(password.length < 1){
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    status: HTTP_STATUS.BAD_REQUEST,
                    error: 'empty password'
                });
        
                return;
             }
    
             console.log({admin})

            if(!admin){
                console.log('hg')

                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    status: HTTP_STATUS.BAD_REQUEST,
                    error: 'wrong token'
                });
        
                return;
             }
                console.log({admin})
    
                if (!admin) {
        
                    res.status(400).json({
                        status: 400,
                        error: `User with email: ${req.decode.email} does not exist`
                    })
                    return;
                }
                const salt = await bcrypt.genSalt(10);
                const hashed = await bcrypt.hash(password, salt);
        
                console.log(salt, hashed)
                await admin.updateOne({
                    password: password && hashed
                });
        
                await admin.save();
    
                let registered = await Admin.findOne({ email: req.decode.email });
        
                const token = utils.encodeToken(admin._id, true, admin.email);
        
                    res.status(200).json({
                        status: 200,
                        data: registered,
                        token: token,
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
export default verifyEmployee;



