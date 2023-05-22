
import dotenv from 'dotenv';
import Employee from '../../model/Employees';

dotenv.config();


const deleteEmployee = async (req, res) => {

    try {


        let employee = await Employee.findOne({ _id: req.params.id});


        if (!employee) {
            res.status(400).json({
                status: 400,
                error: 'Employee not found'
            })
            return;
        }

        Employee.remove({ _id: req.params.id },
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

            })
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })
    }
}
export default deleteEmployee;
