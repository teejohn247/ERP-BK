
import dotenv from 'dotenv';
import Role from '../../model/Role';
import Company from '../../model/Company';
import Leave from '../../model/Leaves';




const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const createLeave = async (req, res) => {

    try {
       
        const { leaveName, description } = req.body;


        let company = await Company.findOne({ _id: req.payload.id });

        if(!leaveName || leaveName == ''){

            res.status(400).json({
                status: 400,
                error: 'Leave Name is required'
            })
            return;
        }

        let designation = await Leave.findOne({ companyId:company._id,  leaveName: leaveName });

        console.log({company})

        if (!company.companyName) {

            res.status(400).json({
                status: 400,
                error: 'No company has been created for this account'
            })
            return;
        }


        if (designation) {

            res.status(400).json({
                status: 400,
                error: 'This leaveName already exist'
            })
            return;
        }

       let leave = new Leave({
            leaveName,
            companyId: req.payload.id,
            companyName: company.companyName,
            description,
        })

        await leave.save().then((adm) => {
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
export default createLeave;



