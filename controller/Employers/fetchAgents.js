import dotenv from 'dotenv';
import Employee from '../../model/Employees';
import EmployeeTable from '../../model/EmployeeTable';
import Roles from '../../model/Roles';
import utils from '../../config/utils';
import { emailTemp } from '../../emailTemplate';

const sgMail = require('@sendgrid/mail');
dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_KEY);

const fetchAgents = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', sortBy = 'createdAt', sortOrder = -1 } = req.query;
        
        // Create filter object
        let filter = { companyId: req.payload.id, agent: true };
        
        // Add search functionality
        if (search) {
            filter.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }

        // Create sort object
        const sort = {};
        sort[sortBy] = parseInt(sortOrder);

        // Fetch agents with filtering, sorting and pagination
        const agents = await Employee.find(filter)
            .sort(sort)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .exec();

        // Get total count for pagination
        const count = await Employee.countDocuments(filter);

        if (!agents || agents.length === 0) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: 'No agents found',
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
            message: 'Agents fetched successfully',
            totalItems: count,
            totalPages: Math.ceil(count / parseInt(limit)),
            currentPage: parseInt(page),
            data: agents
        });

    } catch (error) {
        console.error('Error fetching agents:', error);
        return res.status(500).json({
            status: 500,
            success: false,
            message: 'Error fetching agents',
            error: error.message
        });
    }
};

export default fetchAgents;



