
import dotenv from 'dotenv';
import Department from '../../model/Department';
import Employee from '../../model/Employees';


const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const updateDepartment = async (req, res) => {

    try {

        const {departmentName, managerId} = req.body;
        const department = await Department.find({_id: req.params.id})
        const employee = await Employee.findOne({_id: managerId})

        if(!department){
            res.status(404).json({
                status:404,
                success: false,
                error:'No department Found'
            })
            return
        }

        Department.findOneAndUpdate({ _id: req.params.id}, { 
            $set: { 
                departmentName: departmentName && departmentName,
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
export default updateDepartment;



