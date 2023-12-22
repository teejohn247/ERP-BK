
import dotenv from 'dotenv';
import Employee from '../../model/Employees';
import Department from '../../model/Department';
import Designation from '../../model/Designation';

import Company from '../../model/Company';
import AuditTrail from '../../model/AuditTrail';
import LeaveRecords from '../../model/LeaveRecords';

dotenv.config();


const deleteCompany = async (req, res) => {

    try {
        let company = await Company.find({ _id: req.payload.id });

        let employee = await Employee.findOne({ _id: req.params.id });


        if (!company) {
            res.status(400).json({
                status: 400,
                error: 'Company not found'
            })
            return;
        }

        Company.remove({ _id: req.payload.id },
            function (
                err,
                result
            ) {

                console.log(result)

                if (err) {
                    res.status(401).json({
                        status: 401,
                        success: false,
                        error: err
                    })
                }
                else {

                    Employee.deleteMany({companyId: req.payload.id },
                        function (
                            err,
                            result
                        ) {
            
                            console.log(result)
            
                            if (err) {
                                res.status(401).json({
                                    status: 401,
                                    success: false,
                                    error: err
                                })
                            }
                            else {
            
                                            res.status(200).json({
                                                status: 200,
                                                success: true,
                                                data: "Employee Deleted successfully!"
                                            })
            
                            }
            
                            
                        }).then(() => {
                            Department.deleteMany({companyId: req.payload.id },
                                function (
                                    err,
                                    result
                                ) {
                    
                                    console.log(result)
                    
                                    if (err) {
                                        res.status(401).json({
                                            status: 401,
                                            success: false,
                                            error: err
                                        })
                                    }
                                    else {
                    
                                        Designation.deleteMany({companyId: req.payload.id },
                                            function (
                                                err,
                                                result
                                            ) {
                                
                                                console.log(result)
                                
                                                if (err) {
                                                    res.status(401).json({
                                                        status: 401,
                                                        success: false,
                                                        error: err
                                                    })
                                                }
                                                else {
                                
                                                    LeaveRecords.deleteMany({companyId: req.payload.id },
                                                        function (
                                                            err,
                                                            result
                                                        ) {
                                            
                                                            console.log(result)
                                            
                                                            if (err) {
                                                                res.status(401).json({
                                                                    status: 401,
                                                                    success: false,
                                                                    error: err
                                                                })
                                                            }
                                                            else {
                                            
                                                                            res.status(200).json({
                                                                                status: 200,
                                                                                success: true,
                                                                                data: "Company Deleted successfully!"
                                                                            })
                                            
                                                            }
                                            
                                                            
                                                        })
                                
                                                }
                                
                                                
                                            })
                                    }
                    
                                    
                                })
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
export default deleteCompany;
