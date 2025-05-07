import dotenv from 'dotenv';
import Employee from '../../model/Employees';
import EmployeeTable from '../../model/EmployeeTable';
import Roles from '../../model/Roles';
import utils from '../../config/utils';
import { emailTemp } from '../../emailTemplate';

const sgMail = require('@sendgrid/mail');
dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_KEY);

const fetchEmployeesByDepartment = async (req, res) => {
    try {
        const { 
            department, 
            page = 1, 
            limit = 10,
            search = '',
            sortBy = 'createdAt',
            sortOrder = -1
        } = req.query;

        if (!department) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: 'Department ID is required',
                totalItems: 0,
                totalPages: 0,
                currentPage: parseInt(page),
                data: []
            });
        }

        // Create filter object
        let filter = {
            companyId: req.payload.id,
            departmentId: department
        };
        
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
            
        // Get employee table data
        const employeeTable = await EmployeeTable.find();
        
        // Get total count for pagination
        const count = await Employee.countDocuments(filter);

        if (!employees || employees.length === 0) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: 'No employees found in this department',
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
        console.error("[fetchEmployeesByDepartment] Error:", error);
        return res.status(500).json({
            status: 500,
            success: false,
            message: 'Error fetching employees by department',
            error: error.message
        });
    }
};

export default fetchEmployeesByDepartment;



