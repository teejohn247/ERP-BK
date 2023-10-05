
import dotenv from 'dotenv';
import Department from '../../model/Department';
import Employee from '../../model/Employees';



dotenv.config();


const assignManager = async (req, res) => {

    try {

        const {managerId, departmentId} = req.body;
        const department = await Department.find({_id: departmentId})
        const employee = await Employee.findOne({_id: managerId})

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

                   Employee.updateMany({department: department.departmentName}, { 
                    $set: { 
                        managerName: employee && `${employee.firstName} ${employee.lastName}`,
                        managerId: managerId
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
        
                        } else {
        
                            res.status(200).json({
                                status: 200,
                                success: true,
                                data: "Update Successful"
                            })
        
                        }
                    })


                    res.status(200).json({
                        status: 200,
                        success: true,
                        data: "Update Successful"
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



