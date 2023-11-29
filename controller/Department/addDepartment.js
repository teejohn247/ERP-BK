
import dotenv from 'dotenv';
import Department from '../../model/Department';
import Company from '../../model/Company';
import Employee from '../../model/Employees';




const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const addDepartment = async (req, res) => {

    try {

        const {departmentName, managerId} = req.body;
        let departmentN = await Department.findOne({ companyId: req.payload.id, departmentName: departmentName });
        let companyName = await Company.findOne({ _id: req.payload.id });

        if(managerId){
            var employee = await Employee.findOne({_id: managerId})

            if (!employee) {

                res.status(400).json({
                    status: 400,
                    error: 'This employee does not exist'
                })
                return;
            }
        }

        if (departmentN) {

            res.status(400).json({
                status: 400,
                error: 'This department Name already exist'
            })
            return;
        }

       let department = new Department({
            departmentName,
            companyId: req.payload.id,
            companyName: companyName.companyName,
            managerName: employee ? `${employee.firstName} ${employee.lastName}` : '',
            managerId: managerId ? managerId : ''
        })


        await department.save().then((adm) => {

                //        Employee.updateMany({department: department.departmentName}, { 
                //         $set: { 
                //             managerName: employee && `${employee.firstName} ${employee.lastName}`,
                //             managerId: managerId && managerId
                //         }
                //    },
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
            
                //             } 
                //         })
    
                        if(employee){
    
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
    
                    }
                        res.status(200).json({
                            status: 200,
                            success: true,
                            data: adm
                        })
    
                    
               

            // sgMail.send(msg)
            console.log(adm)
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
export default addDepartment;



