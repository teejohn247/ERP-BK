
import dotenv from 'dotenv';
import Role from '../../model/Role';
import Company from '../../model/Company';
import Leave from '../../model/Expense';
import AppraisalGroup from '../../model/Kpi';
import Group from '../../model/AppraisalGroup';
import Employees from '../../model/Employees';
import AppraisalData from '../../model/AppraisalData';





const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const createKPI = async (req, res) => {

    try {
       
        const { name, description, group, employeeIds, fields} = req.body;


        let company = await Company.findOne({ _id: req.payload.id });

        console.log({company})

        let appraisal = await AppraisalGroup.findOne({ companyId:company._id,  kpiName: name });
        let groupArray= await Group.findOne({ _id: group });


        console.log({groupArray})
        console.log({appraisal})

        const tst = await Group.findOne({ companyId: req.payload.id, _id: group })

        console.log({tst})
  


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
                error: 'This kpi name already exist'
            })
            return;
        }


console.log({groupArray})
        if(groupArray.groupName == "specific" || groupArray.groupName == "Specific" ){
            let groups = [];

        // let appraisal = await AppraisalGroup.findOne({ companyId:company._id,  groupName: name });


        //     // let employees = [];
        //     let departments = [];
        //     let departmentIds = [];

            if (employeeIds.length < 1) {
                res.status(400).json({
                    status: 400,
                    error: 'employeeIds is required'
                })
                return;
            }

            console.log('lope')
    
            for (const groupId of employeeIds) {
                console.log({ groupId });
        
                try {
                    const group1 = await Employees.findOne({ _id: groupId });

                    console.log({group1})
                    
                    groups.push({
                        employee_id: groupId,
                        employee_name: group1.fullName,
                    });
                    console.log({ group1 });
                } catch (err) {
                    console.error(err);
                }
            }
    
           await new AppraisalGroup({
                    kpiName: name,
                    companyId: req.payload.id,
                    companyName: company.companyName,
                    description,
                    assignedEmployees: groups
            }).save().then(async (adm) => {
                console.log({adm})
                const appraisals = await Group.findOne({_id : group}, {_id: 1, groupName:1, groupKpis: 1, description: 1})
                
                console.log({appraisals})

                Group.findOneAndUpdate({ _id:  group}, { 
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
                                $push: { appraisals },
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

                                        console.log({manager})

                            
                                        // res.status(200).json({
                                        //     status: 200,
                                        //     success: true,
                                        //     data: adm
                                        // })

                                        // return;
                    

                                                  

                                const tst = await Group.findOne({ _id: group });
                                console.log({group})
                                console.log({tst})
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
                                            console.log('2345',{result})
                        
                                            const manager = await AppraisalData.find({companyId: req.payload.id, "kpiGroups.$.groupId": group });
                                            console.log('2345',{manager})
                        
                                            // res.status(200).json({
                                            //     status: 200,
                                            //     success: true,
                                            //     data: "Successfully assigned"
                                            // })
        
                                            console.log({group})
        
                                         console.log(req.payload.id, '123')
                                         AppraisalData.updateMany({companyId: req.payload.id }, {
                                            $push: {
                                              "kpiGroups.$[group].groupKpis": {
                                                kpiId: adm._id,
                                                kpiName: name,
                                                kpiDescription: description
                                              }
                                            }
                                          },
                                          {
                                            arrayFilters: [{ "group.groupId": group }]
                                          
                                    }, // Update multiple documents
                                    async function (
                                        err,
                                        result
                                    ) {
                                        if (err) {
                                            console.log({err})
                                            res.status(401).json({
                                                status: 401,
                                                success: false,
                                                error: err
                                            })
                        
                                        } else {
                        
                                            // const manager = await AppraisalGroup.findOne({_id: groupId});
                                            console.log('2',{result})
    
    
                        
                                            // res.status(200).json({
                                            //     status: 200,
                                            //     success: true,
                                            //     data: "Successfully assigned"
                                            // })
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

                    
                                    }
                                })

                  






























                        //     AppraisalData.updateMany({companyId: req.payload.id }, {
                        //         $push: {
                        //           "kpiGroups.$[group].groupKpis": {
                        //             kpiId: adm._id,
                        //             kpiName: name,
                        //             kpiDescription: description
                        //           }
                        //         }
                        //       },
                        //       {
                        //         arrayFilters: [{ "group.groupId": group }]
                              
                        // }, // Update multiple documents
                        // async function (
                        //     err,
                        //     result
                        // ) {
                        //     if (err) {

                        //         console.log({err})
                        //         res.status(401).json({
                        //             status: 401,
                        //             success: false,
                        //             error: err
                        //         })
            
                        //     } else {
            
                        //         // const manager = await AppraisalGroup.findOne({_id: groupId});
                        //         console.log('2',{result})
            
                        //         // res.status(200).json({
                        //         //     status: 200,
                        //         //     success: true,
                        //         //     data: "Successfully assigned"
                        //         // })
                        //         // res.status(200).json({
                        //         //     status: 200,
                        //         //     success: true,
                        //         //     data: result
                        //         // })
                    
                        //         // return;
            
                        //     }
                        // })
                             
        
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
                
                                    const manager = await AppraisalData.find({companyId: req.payload.id, "kpiGroups.$.groupId": group });
                                    console.log('2345',{manager})
                
                                    // res.status(200).json({
                                    //     status: 200,
                                    //     success: true,
                                    //     data: "Successfully assigned"
                                    // })

                                    console.log({group})

                                 console.log(req.payload.id, '123')
                                 AppraisalData.update({companyId: req.payload.id }, {
                                    $push: {
                                      "kpiGroups.$[group].groupKpis": {
                                        kpiId: adm._id,
                                        kpiName: name,
                                        kpiDescription: description
                                      }
                                    }
                                  },
                                  {
                                    arrayFilters: [{ "group.groupId": group }]
                                  
                            }, // Update multiple documents
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
                                    console.log('2',{result})
                
                                    // res.status(200).json({
                                    //     status: 200,
                                    //     success: true,
                                    //     data: "Successfully assigned"
                                    // })
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

   
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })
    }
}
export default createKPI;



