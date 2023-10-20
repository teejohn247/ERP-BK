
import dotenv from 'dotenv';
import Kpi from '../../model/Kpi';
import AppraisalGroup from '../../model/AppraisalGroup';
import addDepartment from '../Department/addDepartment';



dotenv.config();


const assignGroupsDepartment = async (req, res) => {

    try {

        const { departments, appraisalId } = req.body;
        const appraisal = await AppraisalGroup.findOne({_id: appraisalId})

        if(!departments){
            res.status(404).json({
                status:404,
                success: false,
                error:'GroupId is required'
            })
            return
        }


        if(!appraisalId){
            res.status(404).json({
                status:404,
                success: false,
                error:'appraisalId Not Found'
            })
            return
        }

        if(!appraisalId){
            res.status(404).json({
                status:404,
                success: false,
                error:'appraisal does not exist'
            })
            return
        }

        if(!appraisal){
            res.status(404).json({
                status:404,
                success: false,
                error:'appraisal does not exist'
            })
            return
        }


            const dd = []


         let checks_group = await addDepartment.find({ _id:  { $in: departments }},
            {assignedTo: { $elemMatch: { _id: appraisalId } } })

                    checks_group.map((chk) => {
                        if(chk.assignedTo.length > 0){
                            dd.push(chk.assignedTo)
                        }
                    })


            if(dd.length > 0){
                res.status(404).json({
                    status:404,
                    success: false,
                    error:'kpi has already been assigned to group'
                })
                return
            }


            let groups = [];
            console.log(groupIds)
    
            for (const groupId of departments) {
                console.log({ groupId });
        
                try {
                    const group = await addDepartment.findOne({ _id: groupId });
                    groups.push({
                        department_id: groupId,
                        department_name: group.departmentName,
                    });
                    console.log({ group });
                } catch (err) {
                    console.error(err);
                }
            }

        AppraisalGroup.findOneAndUpdate({ _id: appraisalId}, { 
            $push: { assignedDepartments: {
                assignGroupsDepartment: groups
            }},
       },{ upsert: true },
            async function (
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

                    // const manager = await AppraisalGroup.findOne({_id: groupId});

                    res.status(200).json({
                        status: 200,
                        success: true,
                        data: "Successfully assigned"
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
export default assignGroupsDepartment;



