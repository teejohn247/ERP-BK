import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import Admin from '../../model/Company';
import utils from '../../config/utils';

const sgMail = require('@sendgrid/mail')



sgMail.setApiKey(process.env.SENDGRID_KEY);


dotenv.config();

const signin = async (req, res) => {

    try {
        const { email, password } = req.body;


        // let useragent = req.useragent;
        // let detectResult = req.device;


        let admin = await Admin.findOne({ adminEmail: email });

        console.log(admin)

        if (!admin) {
            res.status(400).json({
                status: 400,
                success: false,
                error: 'Account does not exist'
            })
            return;
        }




        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            res.status(404).json({
                status: 404,
                success: false,
                error: 'Invalid login credentials'
            })
            return;
        }
        console.log(isMatch)


        if (!admin.firstTimeLogin) {
        console.log("here")
            
            await admin.updateOne({

                firstTimeLogin: true, 
            
            });
        }else if (admin.firstTimeLogin == true){
            await admin.updateOne({
                firstTimeLogin: false, 
            });
        }

        let company = await Admin.findOne({ adminEmail: email  });

        const token = utils.encodeToken(admin._id, admin.adminEmail);

        res.status(200).json({
            status: 200,
            data: company,
            token: token
        })
      
        } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })
    }
}

export default signin;
