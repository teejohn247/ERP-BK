import dotenv from 'dotenv';
import Role from '../../model/ExpenseRequests';


import { emailTemp } from '../../emailTemplate';


const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);




const fetchExpenseReqs= async (req, res) => {

    try {

        const { 
            page = 1, 
            limit = 10, 
            status, 
            startDate, 
            endDate, 
            expenseTypeId,
            search = '',
            sortBy = 'dateRequested',
            sortOrder = -1
        } = req.query;

        // Build filter object
        let filterQuery = { employeeId: req.payload.id };
        
        if (status) {
            filterQuery.status = status;
        }
        
        if (startDate && endDate) {
            filterQuery.expenseDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        
        if (expenseTypeId) {
            filterQuery.expenseTypeId = expenseTypeId;
        }
        
        // Add search functionality
        if (search) {
            filterQuery.$or = [
                { expenseName: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { reference: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Create sort object
        const sort = {};
        sort[sortBy] = parseInt(sortOrder) || -1;

        // Get total count for pagination
        const count = await Role.find(filterQuery).countDocuments();

        const role = await Role.find(filterQuery)
            .sort(sort)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .exec();

        console.log(role)

        res.status(200).json({
            status: 200,
            success: true,
            data: role,
            totalRecords: count,
            totalPages: Math.ceil(count / parseInt(limit)),
            currentPage: parseInt(page),
            limit: parseInt(limit)
        });
        return;
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })
    }
}
export default fetchExpenseReqs;



