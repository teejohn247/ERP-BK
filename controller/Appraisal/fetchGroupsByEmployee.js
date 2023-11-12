
import dotenv from 'dotenv';
import AppraisalGroup from '../../model/AppraisalGroup';



const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const fetchGroupsByEmployee = async (req, res) => {

    try {

        const { page, limit } = req.query;


        const appraisalGroups = await AppraisalGroup.find({
            'assignedEmployees.employee_id': req.payload.id,
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
export default fetchGroupsByEmployee;


