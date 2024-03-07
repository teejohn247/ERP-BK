
import dotenv from 'dotenv';
import AppraisalGroup from '../../model/AppraisalData';
import Appraisals from '../../model/AppraisalGroup';

import Employee from '../../model/Employees';


const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const fetchGroupsByPeriod = async (req, res) => {

    try {

        const { employeeId, appraisalPeriodId } = req.params;

        const emop = await Employee.findOne({_id: employeeId})
        console.log({emop});

        const appraisalGroups = await AppraisalGroup.find({
            employeeId: employeeId,
            // appraisalPeriodId: appraisalPeriodId
        }).sort({ createdAt: -1 }) // Assuming createdAt is the timestamp field
        .limit(1);

       const groups =await Appraisals.find({
            assignedEmployees: {
              $elemMatch: {
                employee_id: employeeId
              }
            }
          }, {_id: 1, groupName:1, groupKpis: 1, description: 1});

          if (groups.length > 0) {
            // Ensure appraisalGroups is initialized as an object with a kpiGroups array
            if (!appraisalGroups.kpiGroups) {
              appraisalGroups.kpiGroups = [];
            }
            // Push groups into appraisalGroups.kpiGroups
            await groups.forEach(group => {
                const plainGroup = group.toObject();
              appraisalGroups.kpiGroups.push(plainGroup);
            });

            console.log(appraisalGroups, 'here'); // Check the updated kpiGroups

            res.status(200).json({
                status: 200,
                success: true,
                data: appraisalGroups
            });
          } else {
            console.log("No matching groups found.");
          }
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })
    }
}
export default fetchGroupsByPeriod;



