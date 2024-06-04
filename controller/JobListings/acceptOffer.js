
import dotenv from 'dotenv';
import Role from '../../model/Role';
import Company from '../../model/Company';
import JobPostForms from '../../model/JobPost';
import JobPost from '../../model/Form';
import Employee from '../../model/Employees';
import Department from '../../model/Department';

const sgMail = require('@sendgrid/mail')
dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_KEY);

const changeStage = async (req, res) => {

    try {
       
        const { accepted } = req.body;


        let company = await Company.findOne({ _id: req.payload.id });
        console.log({company})

        const job = await JobPost.findOne({_id: req.params.id})
        const jobForm = await JobPostForms.findOne({_id: req.params.jobListing})

        console.log({job})

        const hr = await Employee.findOne({ _id: jobForm?.hiringManagerID });
        const hrCompany = await Company.findOne({ _id: hr.companyId });

        console.log({hr})

        console.log({hrCompany})

        if (!company && !hrCompany) {

            res.status(400).json({
                status: 400,
                error: 'Company does not exist'
            })
            return;
        }

        if (!job) {

            res.status(400).json({
                status: 400,
                error: 'This job application does not exist'
            })
            return;
        }

        if(company){

            let data = `${offerLetter}`

            let resp = emailTemp(data, 'Offer Letter')


            const receivers = [
            {
                email: hr?.email
            }
            ]

            await sendEmail(req, res, 'teejohn247@gmail.com', receivers, 'Offer Letter', resp);

           JobPost.findOneAndUpdate({ _id: req.params.id}, { 
                $set: { 
                    offerAccepted: accepted, 
                }
            },
                function (
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
                        console.log({result})
                        res.status(200).json({
                            status: 200,
                            success: true,
                            data: ""
                        })
    
                    }
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
export default changeStage;