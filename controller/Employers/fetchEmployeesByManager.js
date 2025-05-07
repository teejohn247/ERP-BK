import dotenv from 'dotenv';
import Employee from '../../model/Employees';
import EmployeeTable from '../../model/EmployeeTable';
import Roles from '../../model/Roles';
import utils from '../../config/utils';
import { emailTemp } from '../../emailTemplate';

const sgMail = require('@sendgrid/mail');
dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_KEY);

const fetchEmployeesByManager = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            search = '',
            department,
            sortBy = 'createdAt',
            sortOrder = -1
        } = req.query;
        
        // Find the employee's manager ID
        const employ = await Employee.findOne({ _id: req.payload.id });
        
        if (!employ) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: 'Employee not found',
                totalItems: 0,
                totalPages: 0,
                currentPage: parseInt(page),
                data: []
            });
        }
        
        // Create filter object
        let filter = { managerId: employ.managerId };
        
        // Add department filter if provided
        if (department) {
            filter.departmentId = department;
        }
        
        // Add search functionality
        if (search) {
            filter.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { employeeCode: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Create sort object
        const sort = {};
        sort[sortBy] = parseInt(sortOrder);

        // Fetch employees with pagination
        const employees = await Employee.find(filter)
            .sort(sort)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .exec();
        
        // Get total count for pagination
        const count = await Employee.countDocuments(filter);
        
        // Get employee table data
        const employeeTable = await EmployeeTable.find();

        if (!employees || employees.length === 0) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: 'No employees found under this manager',
                totalItems: 0,
                totalPages: 0,
                currentPage: parseInt(page),
                data: []
            });
        }
        
        // Return successful response with pagination at top level
        return res.status(200).json({
            status: 200,
            success: true,
            message: 'Employees fetched successfully',
            totalItems: count,
            totalPages: Math.ceil(count / parseInt(limit)),
            currentPage: parseInt(page),
            employeeTable,
            data: employees
        });

    } catch (error) {
        console.error("[fetchEmployeesByManager] Error:", error);
        return res.status(500).json({
            status: 500,
            success: false,
            message: 'Error fetching employees by manager',
            error: error.message
        });
    }
};

export default fetchEmployeesByManager;



