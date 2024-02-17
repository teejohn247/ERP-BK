
import dotenv from 'dotenv';
import AppraisalGroup from '../../model/AppraisalData';
import Employee from '../../model/Employees';


const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const fetchGroupsByPeriod = async (req, res) => {

    try {

        const { employeeId, appraisalPeriodId } = req.params;

        const empp = await Employee.findOne({_id:employeeId })
        console.log({empp})


        const appraisalGroups = await AppraisalGroup.find({
            employeeId: employeeId,
            appraisalPeriodId: appraisalPeriodId
        });


      

        res.status(200).json({
            status: 200,
            success: true,
            data: appraisalGroups
        });

    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })
    }
}
export default fetchGroupsByPeriod;



