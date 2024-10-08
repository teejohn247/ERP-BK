
import dotenv from 'dotenv';
import Department from '../../model/Department';
import Employee from '../../model/Employees';
import Company from '../../model/Company';



dotenv.config();


const assignManager = async (req, res) => {

    try {

        const {managerId, departmentId} = req.body;
        const department = await Department.findOne({_id: departmentId})
        const employee = await Employee.findOne({_id: managerId})
        const check = await Employee.findOne({ _id: managerId });
        let company = await Company.findOne({ _id: req.payload.id });

        console.log(check, company._id)
        if(!managerId){
            res.status(404).json({
                status:404,
                success: false,
                error:'ManagerId is required'
            })
            return
        }


        if(!department){
            res.status(404).json({
                status:404,
                success: false,
                error:'No department Found'
            })
            return
        }

        if(!employee){
            res.status(404).json({
                status:404,
                success: false,
                error:'Employee does not exist'
            })
            return
        }

        if (check.companyId !== company._id.toString()) {
            res.status(400).json({
                status: 400,
                error: "Manager does not belong to this company"
            });
            return;
        }

        Department.findOneAndUpdate({ _id: departmentId}, { 
            $set: { 
                managerName: employee && `${employee.firstName} ${employee.lastName}`,
                managerId: managerId
            }
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

                    const approval = [{
                        approvalType: 'leave',
                        approval: `${check.firstName} ${check.lastName}`,
                        approvalId: managerId
                    },
                    {
                        approvalType: 'expense',
                        approval: `${check.firstName} ${check.lastName}`,
                        approvalId: managerId
                    },
                    {
                        approvalType: 'appraisal',
                        approval: `${check.firstName} ${check.lastName}`,
                        approvalId: managerId
                    },
                ]


                   Employee.updateMany({department: department.departmentName}, { 
                    $set: { 
                        managerName: employee && `${employee.firstName} ${employee.lastName}`,
                        managerId: managerId,
                        approvals: approval
                    }
               },
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
                    })


                   Employee.updateOne({_id: managerId}, { 
                    $set: { 
                        isManager: true
                    }
               },
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
                    })

                    


                    const manager = await Employee.findOne({_id: managerId});

                    res.status(200).json({
                        status: 200,
                        success: true,
                        data: manager
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
export default assignManager;



