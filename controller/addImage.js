
import dotenv from 'dotenv';





const sgMail = require('@sendgrid/mail')

dotenv.config();



sgMail.setApiKey(process.env.SENDGRID_KEY);



const addImage = async (req, res) => {

    res.status(200).json({
        status: 200,
        success: true,
        data: req.file.location,
        // error: err
    })
}
export default addImage;
