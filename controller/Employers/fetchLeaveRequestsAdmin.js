import dotenv from 'dotenv';
import Role from '../../model/ExpenseRequests';
import Employee from '../../model/Employees';
import Company from '../../model/Company';



import { emailTemp } from '../../emailTemplate';


const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const fetchExpenseReqsAdmin = async (req, res) => {

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

        const user =  await Employee.findOne({_id: req.payload.id, isManager: true})
        const company=  await Company.findOne({_id: req.payload.id})


        if(!user && !company){
            res.status(400).json({
                status: 400,
                success: false,
                data: "This employee is not a manager",
            })

            return;
        }

        // Build filter object
        const buildFilter = (baseFilter) => {
            let filter = { ...baseFilter };
            
            if (status) {
                filter.status = status;
            }
            if (startDate && endDate) {
                filter.dateRequested = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                };
            }
            if (expenseTypeId) {
                filter.expenseTypeId = expenseTypeId;
            }
            
            // Add search functionality
            if (search) {
                filter.$or = [
                    { expenseName: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    { employeeName: { $regex: search, $options: 'i' } }
                ];
            }
            
            return filter;
        };

        // Create sort object
        const sort = {};
        sort[sortBy] = parseInt(sortOrder) || -1;

        if(user){
            const baseFilter = {
                approverId: req.payload.id,
                companyId: user.companyId ? user.companyId : company._id
            };
            const filter = buildFilter(baseFilter);

            const count = await Role.find(filter).countDocuments();
            
            const role = await Role.find(filter)
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
        }
        else if(company){
            const baseFilter = {
                companyId: company._id
            };
            const filter = buildFilter(baseFilter);

            const count = await Role.find(filter).countDocuments();
            
            const role = await Role.find(filter)
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
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })
    }
}
export default fetchExpenseReqsAdmin;



