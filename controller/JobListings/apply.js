
import dotenv from 'dotenv';
import Role from '../../model/Role';
import Company from '../../model/Company';
import JobPost from '../../model/Form';
import Job from '../../model/JobPost';

import Employee from '../../model/Employees';
import Department from '../../model/Department';




const sgMail = require('@sendgrid/mail')
dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_KEY);



const apply = async (req, res) => {

    try {
       
        const { jobTitle, jobTitleID, email, phone, resumeCV, coverLetter, linkedInUrl, howDidYouHearAboutUs, ethnicity, gender } = req.body;
  

        let job = await Job.findOne({ _id: jobTitleID });
        console.log({job})

        if (!job) {

            res.status(400).json({
                status: 400,
                error: 'Job does not exist'
            })
            return;
        }
       
       let jobPost = new JobPost({
            jobTitle, 
            departmentId: job.departmentId,
            departmentName: job.departmentName,
            companyId: job.companyId,
            companyName: job.companyName,
            jobTitleID,
            email, 
            phone, 
            resumeCV, 
            coverLetter, 
            linkedInUrl, 
            howDidYouHearAboutUs, 
            ethnicity, 
            gender 
        })
        
        await jobPost.save().then((adm) => {
            console.log(adm)
            res.status(200).json({
                status: 200,
                success: true,
                data: adm
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
export default apply;