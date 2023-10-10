
import dotenv from 'dotenv';
import LeaveRecords from '../../model/LeaveRecords';
import Employee from '../../model/Employees';
import Company from '../../model/Company';
import AuditTrail from '../../model/AuditTrail';

dotenv.config();


const deleteLeaveApplication = async (req, res) => {

    try {

        let leave = await LeaveRecords.findOne({ _id: req.params.id });


        if (!leave) {
            res.status(400).json({
                status: 400,
                error: 'Leave Record not found'
            })
            return;
        }

        LeaveRecords.remove({ _id: req.params.id },
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

                    Employee.findOneAndUpdate({ _id: req.payload.id}, { 
                        $set: { 
                            "leaveAssignment.$[i].noOfLeaveDays": 0,
                            "leaveAssignment.$[i].comments": "",
                            "leaveAssignment.$[i].leaveStartDate": "",
                            "leaveAssignment.$[i].leaveEndDate": ""
                        }
                   },
                   { 
                    arrayFilters: [
                        {
                            "i._id": leave.leaveTypeId
                        }
                    ]},
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
            
            
                              
                                res.status(200).json({
                                    status: 200,
                                    success: true,
                                    data: "Leave Application Deleted successfully!"
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
export default deleteLeaveApplication;
