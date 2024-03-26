
import dotenv from 'dotenv';
import JobPost from '../../model/Form';



import { emailTemp } from '../../emailTemplate';


const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const listApplications = async (req, res) => {

    try {

        const role = await JobPost.find({jobTitleID: req.params.jobTitleID})

        console.log(role)

        if(!role){
            res.status(404).json({
                status:404,
                success: false,
                error:'No JobPost Found'
            })
            return
        
        }else{
            res.status(200).json({
                status: 200,
                success: true,
                data: role,
            })
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })
    }
}
export default listApplications;



