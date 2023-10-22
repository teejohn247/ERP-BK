
import dotenv from 'dotenv';
import Role from '../../model/Role';
import Company from '../../model/Company';
import Leave from '../../model/Expense';
import AppraisalGroup from '../../model/AppraisalGroup';
import Period from '../../model/AppraisalPeriod';



const sgMail = require('@sendgrid/mail')

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_KEY);



const createGroup = async (req, res) => {

    try {
       
        const { name, description, appraisalPeriodId } = req.body;

        let company = await Company.findOne({ _id: req.payload.id });

        console.log({company});

        let appraisal = await AppraisalGroup.findOne({ companyId:company._id,  groupName: name });
        let appraisalPeriod = await Period.findOne({ companyId:company._id, _id: appraisalPeriodId });


        console.log({appraisal})

        if (!company.companyName) {
            res.status(400).json({
                status: 400,
                error: 'No company has been created for this account'
            })
            return;
        }


        if (appraisal) {
            res.status(400).json({
                status: 400,
                error: 'This appraisal name already exist'
            })
            return;
        }

       let group = new AppraisalGroup({
            groupName: name,
            companyId: req.payload.id,
            companyName: company.companyName,
            description,
            appraisalPeriodId: appraisalPeriodId && appraisalPeriodId,
            appraisalPeriodName: appraisalPeriod ? appraisalPeriod.appraisalPeriodName : "",
            appraisalPeriodStartDate: appraisalPeriod ? appraisalPeriod.StartDate: "",
            appraisalPeriodEndDate: appraisalPeriod ? appraisalPeriod.EndDate: "",
            appraisalPeriodActiveDate: appraisalPeriod ? appraisalPeriod.activeDate: "",
            appraisalPeriodInactiveDate: appraisalPeriod ? appraisalPeriod.inactiveDate : ""
        })

        await group.save().then((adm) => {
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
export default createGroup;



