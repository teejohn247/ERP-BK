import dotenv from 'dotenv';
import Employee from '../../model/Employees';
import Department from '../../model/Department';

dotenv.config();

const fetchSpecificEmployees = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: 'Employee ID is required',
                data: null
            });
        }

        const employee = await Employee.findOne({ _id: req.params.id });

        if (!employee) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: 'No employee found',
                data: null
            });
        }

        // Check for department information
        if (!employee.departmentId && employee.department) {
            try {
                const department = await Department.findOne({ departmentName: employee.department });
                if (department) {
                    employee.departmentId = department._id;
                }
            } catch (deptError) {
                console.error("[fetchSpecificEmployees] Department error:", deptError);
                // Continue even if department isn't found
            }
        }

        // Return successful response
        return res.status(200).json({
            status: 200,
            success: true,
            message: 'Employee fetched successfully',
            data: employee
        });

    } catch (error) {
        console.error("[fetchSpecificEmployees] Error:", error);
        return res.status(500).json({
            status: 500,
            success: false,
            message: 'Error fetching employee details',
            error: error.message
        });
    }
};

export default fetchSpecificEmployees;



