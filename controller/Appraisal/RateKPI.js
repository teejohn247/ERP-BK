
import dotenv from 'dotenv';
import Kpi from '../../model/Kpi';
import AppraisalGroup from '../../model/AppraisalGroup';
import Employee from '../../model/Employees'



dotenv.config();


const rateKPI = async (req, res) => {

    try {



    //     employeeId: { type: String },
    //     employeeName: { type: String },
    //     managerId: { type: String },
    //     managerName: { type: String },
    //     companyName: { type: String },
    //     companyId: { type: String },
    //     appraisalPeriodId: { type: String },
    //     appraisalPeriodName: { type: String },
    //     appraisalPeriodStartDate: { type: String },
    //     appraisalPeriodEndDate: { type: String },
    //     appraisalPeriodActiveDate: { type: String },
    //     appraisalPeriodInactiveDate: { type: String },
    //     groupRating: [{ 
    //     groupId: { type: String },
    //     groupName: { type: String },
    //     groupDescription: { type: String },
    //     groupKpis:[
    //         {
    //             kpiId: { type: String },
    //             kpiName: { type: String },
    //             kpiDescription: { type: String },
    //             // ratingId: { type: String },
    //             // ratingName: { type: String },
    //             // ratingDescription: { type: String },
    //             remarks: { 
    //                 employeeRatingId: { type: String },
    //                 employeeName: { type: String },
    //                 managerRatingId: { type: String },
    //                 managerName: { type: String },
    //                 employeeComment: { type: String },
    //                 managerComment: { type: String }
    //              },
    //         }
    //     ],
    // }],
    //     potentialRating: { type: String },
    //     performanceRating: { type: String },
    //     generalRemarks: { type: String },

        const { groupId, groupKpis } = req.body;
        const kpi = await Kpi.findOne({_id: kpiId})
        let groups = [];

        // const appraisal = await AppraisalGroup.findOne({_id: groups})
        const appraisalGroups = await AppraisalGroup.find({
            'groupKpis.kpiId': kpiId,
          });


          appraisalGroups.map((grp) => {
            groups.push(grp._id)
          })


        const employee = await Employee.findOne({_id: req.payload.id})

        if(!employee){
            res.status(404).json({
                status:404,
                success: false,
                error:'Employee does not exist'
            })
            return
        }
        if(!groups){
            res.status(404).json({
                status:404,
                success: false,
                error:'KPI has not been assigned to any group'
            })
            return
        }


        if(!kpiId){
            res.status(404).json({
                status:404,
                success: false,
                error:'kpiId Not Found'
            })
            return
        }

        if(!kpi){
            res.status(404).json({
                status:404,
                success: false,
                error:'Kpi does not exist'
            })
            return
        }

            const dd = []

         let checks_group = await AppraisalGroup.find({ _id:  { $in: groups }},
            {groupKpis: { $elemMatch: { kpiId: kpiId } } })

                    checks_group.map((chk) => {
                        if(chk.groupKpis.length > 0){
                            dd.push(chk.groupKpis)
                        }
                    })


            // if(dd.length > 0){
            //     res.status(404).json({
            //         status:404,
            //         success: false,
            //         error:'kpi has already been assigned to group'
            //     })
            //     return
            // }

        AppraisalGroup.updateMany({ _id: { $in : groups }}, { 
            $set: { groupKpis: {
                // kpiId: kpiId,
                // kpiName: kpi.kpiName,
                // kpiDescription: kpi.kpiDescription,
                "remarks.employeeComment": employeeComment,
                "remarks.managerName": "",
                "remarks.employeeName": employee ? employee.fullName : "",
                "remarks.managerComment": "",
                "remarks.managerRatingId": "",
                "remarks.employeeRatingId": employeeRatingId,

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
export default rateKPI;



