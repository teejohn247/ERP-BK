
import dotenv from 'dotenv';
import Company from '../../model/Company';
import bcrypt from 'bcrypt';
import HTTP_STATUS from 'http-status-codes';
import jwt_decode from 'jwt-decode';

import utils from '../../config/utils';

const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const verifyNewUser = async (req, res) => {

    try {
       
        const {token} = req.body;
        if(!token){
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                status: HTTP_STATUS.BAD_REQUEST,
                error: 'token is required'
            });
    
            return;
         }
    
         const payload = jwt_decode(token);

         console.log({payload})
         if (!payload) {
          return res.status(500).json({
                status: 500,
                success: false,
                error: "Token can not be decoded"
            })
         } else {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(payload.password, salt);
    
            console.log(salt, hashed)
            let company= new Company({
                adminEmail: payload.email,
                password: hashed,
                isSuperAdmin: true
            });
    
            await company.save();
    
            res.status(200).json({
                status: 200,
                data: company
            })
    
                res.status(HTTP_STATUS.OK).json({
                    status: HTTP_STATUS.OK,
                    success: true,
                    data: payload
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
export default verifyNewUser;



