
import dotenv from 'dotenv';
import Company from '../../model/Company';
import AuditTrail from '../../model/AuditTrail';
import AppraisalGroup from '../../model/AppraisalGroup';
import bcrypt from 'bcrypt';


const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const createCompany = async (req, res) => {

    try {

        console.log(req.payload)
       
        const {companyName, companyAddress, generalSettings} = req.body;
        let company = await Company.findOne({ email: req.payload.email });
        console.log(req.payload.email)

        // if (company.companyName ) {

        //     res.status(400).json({
        //         status: 400,
        //         error: 'A company has already been registered on this account'
        //     })
        //     return;
        // }
        Company.findOneAndUpdate({ email: req.payload.email}, { 
            $set: { 
                companyName: companyName && companyName,
                companyAddress: companyAddress && companyAddress,
                generalSettings: generalSettings && generalSettings,
                activeStatus: true,
                status: true

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
                    new AuditTrail({
                        companyName: companyName,
                        companyId: company._id
                    }).save()


                  new AppraisalGroup({
                        groupName: 'General',
                        companyId: req.payload.id,
                        companyName: company.companyName,
                        description: 'General Group',
                    }).save()

                    new AppraisalGroup({
                        groupName: 'Specific',
                        companyId: req.payload.id,
                        companyName: company.companyName,
                        description: 'Specific Group',
                    }).save()





                    res.status(200).json({
                        status: 200,
                        success: true,
                        data: {
                            companyName: companyName && companyName,
                            email: req.payload.email,
                            companyAddress: companyAddress && companyAddress,
                            generalSettings: generalSettings && generalSettings,
                            activeStatus: true,
                            status: true,

                        }
                    })
                     return

                }
            })


        // let latestCompany = await Company.findOne({ email: req.payload.email });


        // await company.save();

        // res.status(200).json({
        //     status: 200,
        //     data: company
        // })

    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })
    }
}
export default createCompany;



