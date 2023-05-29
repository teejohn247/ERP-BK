
import dotenv from 'dotenv';
import Company from '../../model/Company';
import bcrypt from 'bcrypt';


const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const createCompany = async (req, res) => {

    try {

        console.log(req.payload)
       
        const {companyName} = req.body;
        let company = await Company.findOne({ adminEmail: req.payload.isAdmin });


        if (company.companyName) {

            res.status(400).json({
                status: 400,
                error: 'A company has already been registered on this account'
            })
            return;
        }

        // const salt = await bcrypt.genSalt(10);
        // const hashed = await bcrypt.hash(password, salt);

        // console.log(salt, hashed)

        Company.findOneAndUpdate({ adminEmail: req.payload.adminEmail}, { 
            $set: { 
                companyName: companyName && companyName,
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
                    res.status(200).json({
                        status: 200,
                        success: true,
                        data: "Company Added Successfully"
                    })

                }
            })

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



