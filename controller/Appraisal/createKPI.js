
import dotenv from 'dotenv';
import Role from '../../model/Role';
import Company from '../../model/Company';
import Leave from '../../model/Expense';
import AppraisalGroup from '../../model/Kpi';
import Group from '../../model/AppraisalGroup';
import Employees from '../../model/Employees';





const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const createKPI = async (req, res) => {

    try {
       
        const { name, description, group, employeeIds, fields} = req.body;


        let company = await Company.findOne({ _id: req.payload.id });

        let appraisal = await AppraisalGroup.findOne({ companyId:company._id,  kpiName: name });
        let groupArray= await Group.findOne({ _id: group });


        console.log({groupArray})

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



        if(groupArray.groupName == "specific" || groupArray.groupName == "Specific" ){
            let groups = [];

        // let appraisal = await AppraisalGroup.findOne({ companyId:company._id,  groupName: name });


        //     // let employees = [];
        //     let departments = [];
        //     let departmentIds = [];

        //     if (appraisal) {
        //         res.status(400).json({
        //             status: 400,
        //             error: 'This appraisal name already exist'
        //         })
        //         return;
        //     }

            console.log('lope')
    
            for (const groupId of employeeIds) {
                console.log({ groupId });
        
                try {
                    const group = await Employees.findOne({ _id: groupId });

                    console.log({group})
                    
                    groups.push({
                        employee_id: groupId,
                        employee_name: group.fullName,
                    });
                    console.log({ group });
                } catch (err) {
                    console.error(err);
                }
            }
    
           let group = new AppraisalGroup({
                    kpiName: name,
                    companyId: req.payload.id,
                    companyName: company.companyName,
                    description,
                    assignedEmployees: groups
            })
    
            await group.save().then(async (adm) => {
                console.log(adm)
                const appraisals = await AppraisalGroup.findOne({_id : adm._id}, {_id: 1, groupName:1, groupKpis: 1, description: 1})

                AppraisalGroup.findOneAndUpdate({ _id: adm._id}, { 
                    $push: { assignedEmployees: groups
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
        
                            Employees.findOneAndUpdate({ _id:  { $in: employeeIds }}, { 
                                $push: {  appraisals },
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
                                            data: adm
                                        })

                                        return;
                    

                    
                                    }
                                })
                            }
                            })
                    })
                }
            // }

                // kpiName: name,
                // companyId: req.payload.id,
                // companyName: company.companyName,
                // description,
                // assignedEmployees: groups
                else{
                    let groups = new AppraisalGroup({
                        kpiName: name,
                        companyId: req.payload.id,
                        companyName: company.companyName,
                        description,
                    })
            
                    await groups.save().then(async (adm) => {

                        console.log({adm})

                        Group.findOneAndUpdate({ _id: group }, { 
                            $push: { groupKpis: {
                                kpiId: adm._id,
                                kpiName: name,
                                kpiDescription: description,
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
                                    console.log({result})
                
                                    // res.status(200).json({
                                    //     status: 200,
                                    //     success: true,
                                    //     data: "Successfully assigned"
                                    // })
                
                                }
                            })
                        res.status(200).json({
                            status: 200,
                            success: true,
                            data: adm
                        })
            
                        return;
                    })
                }

   
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })
    }
}
export default createKPI;



