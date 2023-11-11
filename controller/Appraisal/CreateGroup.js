
import dotenv from 'dotenv';
import Role from '../../model/Role';
import Company from '../../model/Company';
import Leave from '../../model/Expense';
import AppraisalGroup from '../../model/AppraisalGroup';
import Period from '../../model/AppraisalPeriod';
import addDepartment from '../../model/Department';



const sgMail = require('@sendgrid/mail')

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_KEY);



const createGroup = async (req, res) => {

    try {
       
        const { name, description, appraisalPeriodId, departments } = req.body;

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

        // assignedDepartments:  [{
        //     department_id: {
        //         type: String,
        //     },
        //     department_name: {
        //         type: String
        //     },
        //     date_assigned: {
        //         type: Date,
        //         default: moment().format('L') 
        //     }
        // }],

        let groups = [];

        for (const groupId of departments) {
            console.log({ groupId });
    
            try {
                const group = await addDepartment.findOne({ _id: groupId });

                console.log({group})
    
                groups.push({
                    department_id: groupId,
                    department_name: group.departmentName,
                });
    
                console.log({ group });
            } catch (err) {
                console.error(err);
            }
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



            AppraisalGroup.findOneAndUpdate({ _id: adm._id}, { 
                $push: { assignedDepartments: groups
                },
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
    
                        addDepartment.findOneAndUpdate({ _id:  { $in: departments }}, { 
                            $push: { departments: {
                                appraisalId: adm._id,
                                appraisalName: adm.groupName,
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
                
                                    const manager = await AppraisalGroup.findOne({_id: adm._id});
                
                                    res.status(200).json({
                                        status: 200,
                                        success: true,
                                        data: manager
                                    })
                
                                }
                            })
    
    
                    }
                })





            // res.status(200).json({
            //     status: 200,
            //     success: true,
            //     data: adm
            // })
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



