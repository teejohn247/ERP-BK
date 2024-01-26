
import dotenv from 'dotenv';
import Role from '../../model/Role';
import Company from '../../model/Company';
import Leave from '../../model/Expense';
import AppraisalGroup from '../../model/AppraisalGroup';
import Period from '../../model/AppraisalPeriod';
import addDepartment from '../../model/Department';
import Employees from '../../model/Employees';




const sgMail = require('@sendgrid/mail')

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_KEY);



const createGroup = async (req, res) => {

    try {
       
        const { name, description, appraisalPeriodId, departments , employeesIds} = req.body;

        let company = await Company.findOne({ _id: req.payload.id });

        console.log({company});

        let appraisal = await AppraisalGroup.findOne({ companyId:company._id,  groupName: name });
        let appraisalPeriod = await Period.findOne({ companyId:company._id, _id: appraisalPeriodId });
        let allEmployees = await Employees.find({ companyId:company._id });
        let allDepartments = await addDepartment.find({ companyId:company._id });



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
        //         default: new Date().toISOString() 
        //     }
        // }],


        if(name == 'General'){
            let groups = [];

            let employees = [];
            let departments = [];
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


            for (const department of allDepartments) {
                console.log({ department });
        
                try {
                    departments.push({
                        department_id:department._id,
                        department_name: department.departmentName,
                    });
                   
                    departmentIds.push(department._id);
        
                    console.log({ departments });
                } catch (err) {
                    console.error(err);
                }
            }

            for (const employee of allEmployees) {
                console.log({ employee });
        
                try {
                   
                    employees.push(employee._id);
        
                    console.log({ employees });
                } catch (err) {
                    console.error(err);
                }
            }
    
           let group = new AppraisalGroup({
                groupName: name,
                companyId: req.payload.id,
                companyName: company.companyName,
                description,
                // appraisalPeriodId: appraisalPeriodId && appraisalPeriodId,
                // appraisalPeriodName: appraisalPeriod ? appraisalPeriod.appraisalPeriodName : "",
                // appraisalPeriodStartDate: appraisalPeriod ? appraisalPeriod.StartDate: "",
                // appraisalPeriodEndDate: appraisalPeriod ? appraisalPeriod.EndDate: "",
                // appraisalPeriodActiveDate: appraisalPeriod ? appraisalPeriod.activeDate: "",
                // appraisalPeriodInactiveDate: appraisalPeriod ? appraisalPeriod.inactiveDate : ""
            })
    
            await group.save().then(async (adm) => {
                console.log(adm)
                const appraisals =await AppraisalGroup.findOne({_id : adm._id}, {_id: 1, groupName:1, groupKpis: 1, description: 1})

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
        
                            Employees.findOneAndUpdate({ _id:  { $in: employees }}, { 
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



                                        console.log(adm)
                                        console.log({departmentIds})
                                        AppraisalGroup.findOneAndUpdate({ _id: adm._id}, { 
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
                                
                                                    addDepartment.findOneAndUpdate({ _id:  { $in: departmentIds }}, { 
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

        } else if(name == "specific"){
            let groups = [];

        let appraisal = await AppraisalGroup.findOne({ companyId:company._id,  groupName: name });


            // let employees = [];
            let departments = [];
            let departmentIds = [];

            if (appraisal) {
                res.status(400).json({
                    status: 400,
                    error: 'This appraisal name already exist'
                })
                return;
            }


    
            for (const groupId of employeesIds) {
                console.log({ groupId });
        
                try {
                    const group = await Employees.findOne({ _id: groupId });

                    console.log({group})
                    
                    groups.push({
                        employee_id: groupId,
                        employee_name: group.employeeName,
                    });
                    console.log({ group });
                } catch (err) {
                    console.error(err);
                }
            }


            // for (const department of allDepartments) {
            //     console.log({ department });
        
            //     try {
            //         departments.push({
            //             department_id:department._id,
            //             department_name: department.departmentName,
            //         });
                   
            //         departmentIds.push(department._id);
        
            //         console.log({ departments });
            //     } catch (err) {
            //         console.error(err);
            //     }
            // }

            // for (const employee of allEmployees) {
            //     console.log({ employee });
        
            //     try {
                   
            //         employees.push(employee._id);
        
            //         console.log({ employees });
            //     } catch (err) {
            //         console.error(err);
            //     }
            // }
    
           let group = new AppraisalGroup({
                groupName: name,
                companyId: req.payload.id,
                companyName: company.companyName,
                description,
                // appraisalPeriodId: appraisalPeriodId && appraisalPeriodId,
                // appraisalPeriodName: appraisalPeriod ? appraisalPeriod.appraisalPeriodName : "",
                // appraisalPeriodStartDate: appraisalPeriod ? appraisalPeriod.StartDate: "",
                // appraisalPeriodEndDate: appraisalPeriod ? appraisalPeriod.EndDate: "",
                // appraisalPeriodActiveDate: appraisalPeriod ? appraisalPeriod.activeDate: "",
                // appraisalPeriodInactiveDate: appraisalPeriod ? appraisalPeriod.inactiveDate : ""
            })
    
            await group.save().then(async (adm) => {
                console.log(adm)
                const appraisals =await AppraisalGroup.findOne({_id : adm._id}, {_id: 1, groupName:1, groupKpis: 1, description: 1})


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
        
                            Employees.findOneAndUpdate({ _id:  { $in: employeesIds }}, { 
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
                                            data: manager
                                        })
                    

                    
                                    }
                                })
        
        
                        }
                    })
    
    
    
    
    
             
            }).catch((err) => {
                    console.error(err)
                    res.status(400).json({
                        status: 400,
                        success: false,
                        error: err
                    })
                })
        }

        else {
            let groups = [];
            let emps = [];
            let empsNames = [];

    
    
            const employee = await Employees.find({ departmentId:  { $in: departments }})

            console.log({employee})

            if(employee.length > 0){

                for (const emp of employee) {
                    console.log({ emp });
            
                    try {
                        console.log({   employee_id: emp._id,
                            employee_name: emp.fullName,});
    
                        empsNames.push({
                            employee_id: emp._id,
                            employee_name: emp.fullName,
                        });
                        emps.push(emp._id);
            
                    } catch (err) {
                        console.error(err);
                    }
                }
        
            }
    
    
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
                                $push: { assignedAppraisals: {
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
    
    
    
                                    //     Employees.findOneAndUpdate({ _id:  { $in: emps }}, { 
                                    //         $push: { assignedAppraisals: {
                                    //             appraisalId: adm._id,
                                    //             appraisalName: adm.groupName,
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
                                
                                    //                 // const manager = await AppraisalGroup.findOne({_id: groupId});
                                
                                    //                 // res.status(200).json({
                                    //                 //     status: 200,
                                    //                 //     success: true,
                                    //                 //     data: "Successfully assigned"
                                    //                 // })
                                
                                    //             }
                                    //         })

                                            AppraisalGroup.findOneAndUpdate({ _id: adm._id}, { 
                                                $push: { assignedEmployees: empsNames
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

                                                        if(employee.length > 0){
                                                           
                const appraisals =await AppraisalGroup.findOne({_id : adm._id}, {_id: 1, groupName:1, groupKpis: 1, description: 1})

                                                            Employees.findOneAndUpdate({ _id:  { $in: emps }}, { 
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
                                                                            data: manager
                                                                        })
                                                    
                                
                                                    
                                                                    }
                                                                })
                                                        }else{

                                                            const manager = await AppraisalGroup.findOne({_id: adm._id});
                    
                                                            res.status(200).json({
                                                                status: 200,
                                                                success: true,
                                                                data: manager
                                                            })

                                                        }
                                    
                                    
                                    
                                    
                                                    }
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
            }
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })
    }
}
export default createGroup;



