
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
                const assignedDept = appraisal.assignedDepartments.find(emp => String(emp.appraisalId) === String(data.departmentId));
                if(!assignedDept){
                oldDepartments.push(data.department_id);
                }
                console.log({  oldDepartments});
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
        let strictIds = []
        const deptEmp = [];

        for (const department of allDepartments) {
            console.log({ department });

            const assignedDept = appraisal.assignedDepartments.find(emp => String(emp.department_id) === String(department._id));
            const assignedEmp= await Employees.find({ departmentId: department._id });


console.log({assignedDept})


                
            try {
            if(!assignedDept){

                departments.push({
                    department_id:department._id,
                    department_name: department.departmentName,
                });
            }

            for(const emm of assignedEmp ){
                if(emm.appraisals.length > 0){

                console.log("lol", assignedEmp.appraisals)
            const assignedEm =emm.appraisals.find(emp => String(emp.appraisalId) === String(req.params.id));
            // strictIds.push(emm._id)

            console.log({assignedEm})

            if(!assignedEm){
                strictIds.push(emm._id)
                deptEmp.push({
                    appraisalId: appraisal._id,
                    appraisalName: appraisal.groupName,
                });
            console.log({assignedEm})

            }
            }else{
                strictIds.push(emm._id)
                console.log({strictIds})
                deptEmp.push({
                    appraisalId: appraisal._id,
                    appraisalName: appraisal.groupName,
                });
            }



            }
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
            console.log(appraisal.assignedEmployees)

    
            try {

            const assignedEmp = appraisal.assignedEmployees.find(emp => emp.employee_id === String(groupId._id));

            console.log({assignedEmp})
             if(!assignedEmp){
                emps.push({
                    employee_id: groupId._id,
                    employee_name: groupId.fullName,
                });
                emps2.push(groupId._id)
             }
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
                // assignedDepartments: []
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

                console.log('8998')

                    AppraisalGroup.findOneAndUpdate({ _id: req.params.id}, { 
                        $push: { assignedDepartments: departments, 
                            ...(emps.length > 0 && { assignedEmployees: emps })
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



                console.log('899800')

                if(oldDepartments.length > 0){
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
                                console.log({result})
                            }
                        })

                }


                            //     addDepartment.findOneAndUpdate({ _id:  { $in: oldDepartments }}, { 
                            //         $pull: { assignedAppraisals: { appraisalId: req.params.id
                            //         }},
                            //    },{ upsert: true },
                            //         async function (
                            //             err,
                            //             result
                            //         ) {
                            //             if (err) {
                            //                 res.status(401).json({
                            //                     status: 401,
                            //                     success: false,
                            //                     error: err
                            //                 })
                        
                            //             } else {
                console.log('898898')
                        
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

                                       console.log('128998')


                                       if(oldEmps.length > 0){



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
                                                }
                                            })

                                       }





                            //          Employees.findOneAndUpdate({ _id:  { $in: oldEmps }}, { 

                            //         $pull: { appraisals: { _id: req.params.id
                            //         }},
                            //    },{ upsert: true },
                            //         async function (
                            //             err,
                            //             result
                            //         ) {
                            //             if (err) {
                            //                 res.status(401).json({
                            //                     status: 401,
                            //                     success: false,
                            //                     error: err
                            //                 })
                        
                            //             } else {

                                       console.log('1028998')
                                       console.log({strictIds})
if(strictIds.length > 0){
                        
                                            Employees.findOneAndUpdate({ _id:  { $in: strictIds }}, { 
                                                $push: { assignedAppraisals: deptEmp}
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
                                    
                                                    }
                                                    else{
                                                        console.log('19928998')

                                                        console.log({result})
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
                                                return
                                                                }
                                                            })
                                                    }else{
                                                        res.status(200).json({
                                                            status: 200,
                                                            success: true,
                                                            data: "Update Successful"
                                                        })

                                                        return

                                                    }
                                                
                                                }
                                                })
                                            } else {

                                            res.status(200).json({
                                                status: 200,
                                                success: true,
                                                data: "Successfully assigned"
                                            })

                                            return;
                                        }
                                            
                                    //     }
                                    // })  
                                } 


                            //     })
            
            
                            // }
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