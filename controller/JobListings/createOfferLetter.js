
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

const createOfferLetter = async (req, res) => {

    try {
       
        const { selected, offerLetter } = req.body;


        let company = await Company.findOne({ _id: req.payload.id });
        console.log({company})

        const recruit = await JobPost.findOne({_id: req.params.id})
        console.log({recruit})

        const hr = await Employee.findOne({ _id: req.payload.id });
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



            let data = `${offerLetter}`

            let resp = emailTemp(data, 'Offer Letter')


            const receivers = [
            {
                email: recruit?.email
            }
            ]

            await sendEmail(req, res, 'teejohn247@gmail.com', receivers, 'Offer Letter', resp);


           JobPost.findOneAndUpdate({ _id: req.params.id}, { 
                $set: { 
                    offerLetterSent: true, 
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

                        JobPostForms.updateOne(
                            { "_id": job.jobTitleID, "applications.applicationId": req.params.id },
                            { $set: { "applications.$.offerLetterSent": true } },
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
                                    res.status(200).json({
                                        status: 200,
                                        success: true,
                                        data: "Application stage updated"
                                    })

                                    return;
                                }
                            }
                         )

                        console.log({result})
                       res.status(200).json({
                                        status: 200,
                                        success: true,
                                        data: "Application Selected Successfully"
                                    })
    
                    }
                })
                
   

        
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })
    }
}
export default createOfferLetter;