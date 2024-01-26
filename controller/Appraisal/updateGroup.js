
import dotenv from 'dotenv';
import Role from '../../model/Role';
import Company from '../../model/Company';
import Leave from '../../model/Expense';
import AppraisalGroup from '../../model/AppraisalGroup';
import createGroup from './CreateGroup';
import addDepartment from '../../model/Department';
import Employees from '../../model/Employees';



const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const updateGroup = async (req, res) => {

    try {
       
        const { name, description, departmentIds } = req.body;


        let company = await Company.findOne({ _id: req.payload.id });

        let appraisalName = await AppraisalGroup.findOne({ companyId:company._id,  groupName: name });
        let appraisal = await AppraisalGroup.findOne({ _id: req.params.id });

        let allDepartments = await addDepartment.find({ _id: departmentIds});

        console.log({appraisal})

        if (!company.companyName) {
            res.status(400).json({
                status: 400,
                error: 'No company has been created for this account'
            })
            return;
        }


        if (appraisalName && String(appraisalName._id) !== req.params.id) {
            res.status(400).json({
                status: 400,
                error: 'This appraisal name already exist on another group'
            })
            return;
        }


        let oldDepartments = [];

        for (const data of appraisal.assignedDepartments) {
            console.log({ data});
    
            try {
                // oldDepartments.push({
                //     department_id: data._department_id,
                //     department_name: data.department_name,
                // });
               
                oldDepartments.push(data.department_id);
    
                console.log({ data });
            } catch (err) {
                console.error(err);
            }
        }

        let oldEmps = [];

        for (const data of appraisal.assignedEmployees) {
            console.log({ data});
    
            try {
                oldEmps.push(data.employee_id);
               
                // departmentIds.push(department._id);
     
                console.log({ data });
            } catch (err) {
                console.error(err);
            }
        }

        let departments = [];

        for (const department of allDepartments) {
            console.log({ department });
    
            try {
                departments.push({
                    department_id:department._id,
                    department_name: department.departmentName,
                });
               
                // departmentIds.push(department._id);
    
                console.log({ departments });
            } catch (err) {
                console.error(err);
            }
        }

        let emps = [];
        let emps2 = [];


        console.log('here')

        const employee = await Employees.find({ departmentId:  { $in: departmentIds }})

            console.log({employee})

            if(employee.length > 0){

        for (const groupId of employee) {
            console.log({ groupId });
    
            try {

                emps.push({
                    employee_id: groupId._id,
                    employee_name: groupId.fullName,
                });
                emps2.push(groupId._id)
    
                // console.log({ group });
            } catch (err) {
                console.error(err);
            }
        }
    }

// change department edit department then automatically remove old ppl and add the people - strip the group of any assignment
// immediately a group is created all the staff in the department are assigned
// if kpi is added, kpi should be assigned to all to the department in group
// specific is only employees, so no department

        AppraisalGroup.findOneAndUpdate({ _id: req.params.id}, { 
            $set: { 
                groupName: name && name,
                companyId: req.payload.id,
                companyName: company.companyName,
                description: description && description,
                assignedDepartments: []
            }
       },
            function (
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

                    AppraisalGroup.findOneAndUpdate({ _id: req.params.id}, { 
                        $push: { assignedDepartments: departments
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

                                addDepartment.findOneAndUpdate({ _id:  { $in: oldDepartments }}, { 
                                    $pull: { assignedAppraisals: { appraisalId: req.params.id
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
                        
                                            addDepartment.findOneAndUpdate({ _id:  { $in: departmentIds }}, { 
                                                $push: { assignedAppraisals: {
                                                    appraisalId: req.params.id,
                                                    appraisalName: appraisal.groupName,
                                                    appraisal
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

                const appraisals =await AppraisalGroup.findOne({_id : req.params.id}, {_id: 1, groupName:1, groupKpis: 1, description: 1})



                                     Employees.findOneAndUpdate({ _id:  { $in: oldEmps }}, { 

                                    $pull: { appraisals: { _id: req.params.id
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
                        
                                            addDepartment.findOneAndUpdate({ _id:  { $in: departmentIds }}, { 
                                                $push: { assignedAppraisals: {
                                                    appraisalId: req.params.id,
                                                    appraisalName: appraisal.groupName,
                                                    appraisal
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
                                    
                                                    }else{
                                                        if(employee.length > 0){

                                                        Employees.findOneAndUpdate({ _id:  { $in: emps2}}, { 
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
                                                
                                                                    // const manager = await AppraisalGroup.findOne({_id: groupId});
                                                
                                                                    res.status(200).json({
                                                                        status: 200,
                                                                        success: true,
                                                                        data: "Successfully assigned"
                                                                    })
                                                
                                                                }
                                                            })
                                                    }else{
                                                        res.status(200).json({
                                                            status: 200,
                                                            success: true,
                                                            data: "Update Successful"
                                                        })

                                                    }
                                                
                                                }
                                                })
                                            
                                        }
                                    })  
                                } 


                                })
            
            
                            }
                        })
                   

                }
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
export default updateGroup;