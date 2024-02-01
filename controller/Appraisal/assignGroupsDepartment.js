
import dotenv from 'dotenv';
import Kpi from '../../model/Kpi';
import AppraisalGroup from '../../model/AppraisalGroup';
import addDepartment from '../../model/Department';
import Employees from '../../model/Employees';




dotenv.config();


const assignGroupsDepartment = async (req, res) => {

    try {

        const { departments, appraisalId } = req.body;
        const appraisal = await AppraisalGroup.findOne({_id: appraisalId})
        // const employ = await Employees.findOne({_id: })
        const allEmployees = await Employees.findOne({companyId: req.body.id})


        console.log({appraisal})

        if(departments.length < 1){
            res.status(404).json({
                status:404,
                success: false,
                error:'departmentId is required'
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

            console.log('here')


        let emps = [];
        let emps2 = [];


        let employees = [];
        let departmentIds = [];



        for (const employee of allEmployees) {
            console.log({ employee });
    
            try {
               
                groups.push({
                    employee_id: employee._id,
                    employee_name: employee.fullName,
                });
    
                console.log({ groups });
            } catch (err) {
                console.error(err);
            }
        }

        console.log('here')

        const employee = await Employees.find({ departmentId:  { $in: departments }})

            console.log({employee})



            if(employee.length > 0){

        for (const groupId of employee) {
            console.log({ groupId });

    
            try {

            const assignedEmp = appraisal.assignedEmployees.find(emp => String(emp.employeeId) === String(groupId._id));

            console.log({assignedEmp})
             if(!assignedEmp){

                emps.push({
                    employee_id: groupId._id,
                    employee_name: groupId.fullName,
                });
                emps2.push(groupId._id)
             }
            console.log({emps2})

                // console.log({ group });
            } catch (err) {
                console.error(err);
            }
        }
    }

         let checks_group = await addDepartment.find({ _id:  { $in: departments }},
            {assignedAppraisals: { $elemMatch: { appraisalId: appraisalId } } })

                    checks_group.map((chk) => {
                        if(chk.assignedAppraisals.length > 0){
                            dd.push(chk.assignedAppraisals)
                        }
                    })

                    console.log({dd})


            // if(dd.length > 0){
            //     res.status(404).json({
            //         status:404,
            //         success: false,
            //         error:'Appraisal has already been assigned to department'
            //     })
            //     return
            // }


            // let groups = [];
    
            // for (const groupId of departments) {
            //     console.log({ groupId });
        
            //     try {
            //         const group = await addDepartment.findOne({ _id: groupId });

            //         console.log({group})
                    
            //         groups.push({
            //             department_id: groupId,
            //             department_name: group.departmentName,
            //         });
            //         console.log({ group });
            //     } catch (err) {
            //         console.error(err);
            //     }
            // }


            let allDepartments = await addDepartment.find({ _id: departments});




            let groups = [];
            let strictIds = []
            const deptEmp = [];
    
            for (const department of allDepartments) {
                console.log({ department });
                console.log( appraisal.assignedDepartments)
    
                const assignedDept = appraisal.assignedDepartments.find(emp => String(emp.department_id) === String(department._id));
    console.log({assignedDept})
               
                const assignedEmp= await Employees.find({ departmentId: department._id });
    
    
    console.log({assignedEmp})
    
    
                    
                try {
                if(!assignedDept){
    
                    groups.push({
                        department_id:department._id,
                        department_name: department.departmentName,
                    });
                }
    
                for(const emm of assignedEmp ){
                    if(emm.appraisals.length > 0){
    
                    console.log("lol", emm.appraisals)
                const assignedEm =emm.appraisals.find(emp => String(emp._id) === String(appraisalId));
                // strictIds.push(emm._id)

                console.log({assignedEm})

    
                console.log({strictIds})
    
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

        AppraisalGroup.findOneAndUpdate({ _id: appraisalId}, { 
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
                        $pull: { assignedAppraisals: { appraisalId:appraisalId
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
    console.log('898898')
            
                                addDepartment.findOneAndUpdate({ _id:  { $in: departments }}, { 
                                    $push: { assignedAppraisals: {
                                        appraisalId,

                                        appraisalName: appraisal.groupName,
                                        appraisal
                                    }},
                               },{ upsert: true },








                //     addDepartment.findOneAndUpdate({ _id:  { $in: departments }}, { 
                //         $push: { assignedAppraisals: {
                //             appraisalId,
                //             appraisalName: appraisal.groupName,
                //         }},
                //    },{ upsert: true },
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

                            //     Employees.findOneAndUpdate({ _id:  { $in: oldEmps }}, { 

                            //         $pull: { appraisals: { _id: appraisalId
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
                                       const appraisals =await AppraisalGroup.findOne({_id : appraisalId}, {_id: 1, groupName:1, groupKpis: 1, description: 1})

                                       console.log('128998')

                                     Employees.findOneAndUpdate({ _id:  { $in: oldEmps }}, { 

                                    $pull: { appraisals: { _id:  appraisalId
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
                                    //    const appraisals =await AppraisalGroup.findOne({_id : req.params.id}, {_id: 1, groupName:1, groupKpis: 1, description: 1})


                                                     

                                                        if(emps2.length > 0){
                                                            console.log({emps2})
                                                            console.log({appraisals})
                                                        Employees.findOneAndUpdate({ _id:  { $in: emps2}}, { 
                                                            $push: {  appraisals: appraisals },
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
                                            
                                        }
                                    })  
                                } 


                                })
            
            
                                // const manager = await AppraisalGroup.findOne({_id: groupId});
            
                                // res.status(200).json({
                                //     status: 200,
                                //     success: true,
                                //     data: "Successfully assigned"
                                // })
            
                            }
                        })


            //     }
            // })
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