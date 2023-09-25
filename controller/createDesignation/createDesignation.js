
import dotenv from 'dotenv';
import Role from '../../model/Role';
import Company from '../../model/Company';
import Designation from '../../model/Designation';
import Leave from '../../model/Leaves';




const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const createDesignation = async (req, res) => {

    try {
       
        const {designationName, description, leaveId, noOfLeaveDays, paidLeave} = req.body;


        let company = await Company.findOne({ _id: req.payload.id });

        let designation = await Designation.findOne({ companyId:company._id,  designationName: designationName });
        let leave = await Leave.findOne({ _id: leaveId });


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
                error: 'This designation name already exist'
            })
            return;
        }

       let designations = new Designation({
            designationName,
            companyId: req.payload.id,
            companyName: company.companyName,
            description,
            leaveId,
            leaveName: leave.leaveName,
            noOfLeaveDays,
            paidLeave
        })

        await designations.save().then((adm) => {
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
export default createDesignation;



