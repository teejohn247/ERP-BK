import dotenv from 'dotenv';
import Payroll from '../../model/Payroll';



const sgMail = require('@sendgrid/mail')

dotenv.config();



sgMail.setApiKey(process.env.SENDGRID_KEY);



const fetchPayroll = async (req, res) => {

    try {
        const { 
            page = 1, 
            limit = 10, 
            employeeName, 
            employeeId, 
            department, 
            startDate, 
            endDate, 
            paymentStatus, 
            payrollMonth, 
            payrollYear,
            search 
        } = req.query;

        // Build filter object
        let filterQuery = { companyId: req.payload.id };
        
        // Add employee filters if provided
        if (employeeName) filterQuery.employeeName = { $regex: employeeName, $options: 'i' };
        if (employeeId) filterQuery.employeeId = employeeId;
        if (department) filterQuery.department = { $regex: department, $options: 'i' };
        
        // Add date range filters if provided
        if (startDate && endDate) {
            filterQuery.paymentDate = { 
                $gte: new Date(startDate), 
                $lte: new Date(endDate) 
            };
        } else if (startDate) {
            filterQuery.paymentDate = { $gte: new Date(startDate) };
        } else if (endDate) {
            filterQuery.paymentDate = { $lte: new Date(endDate) };
        }
        
        // Add payment status filter if provided
        if (paymentStatus) filterQuery.paymentStatus = { $regex: paymentStatus, $options: 'i' };
        
        // Add payroll period filters
        if (payrollMonth) filterQuery.payrollMonth = parseInt(payrollMonth) || payrollMonth;
        if (payrollYear) filterQuery.payrollYear = parseInt(payrollYear);
        
        // Add general search parameter if provided
        if (search) {
            filterQuery.$or = [
                { employeeName: { $regex: search, $options: 'i' } },
                { employeeCode: { $regex: search, $options: 'i' } },
                { department: { $regex: search, $options: 'i' } },
                { paymentStatus: { $regex: search, $options: 'i' } },
                { paymentMethod: { $regex: search, $options: 'i' } },
                { bankName: { $regex: search, $options: 'i' } }
            ];
        }
        
        console.log("[fetchPayroll] Filter query:", filterQuery);

        const payrolls = await Payroll.find(filterQuery)
            .sort({_id: -1})
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Payroll.find(filterQuery).countDocuments();

        if (!payrolls || payrolls.length === 0) {
            return res.status(200).json({
                status: 200,
                success: true,
                data: [],
                message: 'No payroll records found matching the criteria',
                totalPages: 0,
                currentPage: parseInt(page),
                totalRecords: 0
            });
        }

        res.status(200).json({
            status: 200,
            success: true,
            data: payrolls,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            totalRecords: count,
            filters: {
                applied: !!(employeeName || employeeId || department || startDate || 
                          endDate || paymentStatus || payrollMonth || payrollYear || search)
            }
        });

    } catch (error) {
        console.error("[fetchPayroll] Error:", error);
        res.status(500).json({
            status: 500,
            success: false,
            error: error.message || 'An error occurred while fetching payroll records'
        });
    }
}
export default fetchPayroll;



