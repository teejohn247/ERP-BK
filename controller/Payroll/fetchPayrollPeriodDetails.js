import dotenv from 'dotenv';
import Role from '../../model/Debit';
import PayrollPeriod from '../../model/PayrollPeriod';
import PeriodPayData from '../../model/PeriodPayData'
import Employee from '../../model/Employees';
import Company from '../../model/Company';



const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const fetchPayrollPeriodDetails = async (req, res) => {

    try {

        const { page = 1, limit = 10, search = '', status, startDate, endDate, sortBy = 'endDate', sortOrder = -1 } = req.query;

        // Build filter object
        const filter = { _id: req.params.id };
        
        // Add date range filters if provided
        if (startDate && endDate) {
            filter.startDate = { $gte: startDate };
            filter.endDate = { $lte: endDate };
        } else if (startDate) {
            filter.startDate = { $gte: startDate };
        } else if (endDate) {
            filter.endDate = { $lte: endDate };
        }
        
        // Add status filter if provided
        if (status) {
            filter.status = status;
        }
        
        // Add search functionality
        if (search) {
            filter.$or = [
                { payrollPeriodName: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { reference: { $regex: search, $options: 'i' } }
            ];
        }

        // Get total count for pagination
        const count = await PayrollPeriod.countDocuments(filter);

        // Create sort object
        const sort = {};
        sort[sortBy] = sortOrder;

        const role = await PayrollPeriod.find(filter)
        .sort(sort)
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit))
        .exec();


        console.log(role)

        const comp =  await Company.findOne({_id: req.payload.id})
        const employee =  await Employee.findOne({_id: req.payload.id})



     if(comp){


        // let period = await PeriodPayData.findOne({ payrollPeriodId: adm._id});
        // console.log({period})

        const all = [];

        
        const promises = role.map(async (empp) => {
            console.log({ empp });
            
            const period = await PeriodPayData.find({ payrollPeriodId: empp._id });
            console.log({ period });
        
            all.push({
                ...empp.toObject(), // Convert Mongoose document to JS object
                payrollPeriodData: period.map(emp => ({
                  _id: emp._id,
                  companyId: emp.companyId,
                  companyName: emp.companyName,
                  payrollPeriodId: empp._id,
                  firstName: emp.firstName,
                  lastName: emp.lastName,
                  fullName: emp.fullName,
                  profilePic: emp.profilePic,
                  role: emp.role, // Assigning role field from Employee model
                  department: emp.department,
                  designation: emp.designation,
                  employeeId: emp.employeeId,
                  netEarnings: emp.netEarnings,
                  deductions: emp.deductions,
                  dynamicFields: emp.dynamicFields,

                  // bonus: emp.bonus, // Example default values
                  // standard: emp.standard,
                  // basicPay: emp.basicPay,
                  // netEarnings: emp.netEarnings,
                  // pension: emp.pension,
                  // insurance: emp.insurance,
                  totalEarnings: emp.totalEarnings,
                  payeTax: emp.payeTax,
                  status: emp.status, // Default status
                })),
              });
          
              // console.log({ all });
            });
        
          await Promise.all(promises).then(()=> {
            res.status(200).json({
                status: 200,
                success: true,
                data: all,
                totalRecords: count,
                totalPages: Math.ceil(count / parseInt(limit)),
                currentPage: parseInt(page),
                limit: parseInt(limit)
            });
          })

        }else if(employee){

        // let period = await PeriodPayData.findOne({ payrollPeriodId: adm._id});
        // console.log({period})

        const all = [];

        console.log({employee})

        
        const promises = role.map(async (empp) => {
            console.log({ empp });
            
            const period = await PeriodPayData.find({ payrollPeriodId: empp._id, employeeId: req.payload.id});

            console.log({ period });
        
            all.push({
                ...empp.toObject(), // Convert Mongoose document to JS object
                payrollPeriodData: period.map(emp => ({
                  _id: emp._id,
                  companyId: emp.companyId,
                  companyName: emp.companyName,
                  payrollPeriodId: empp._id,
                  firstName: emp.firstName,
                  lastName: emp.lastName,
                  fullName: emp.fullName,
                  profilePic: emp.profilePic,
                  role: emp.role, // Assigning role field from Employee model
                  department: emp.department,
                  designation: emp.designation,
                  employeeId: emp.employeeId,
                  netEarnings: emp.netEarnings,
                  deductions: emp.deductions,
                  dynamicFields: emp.dynamicFields,

                  // bonus: emp.bonus, // Example default values
                  // standard: emp.standard,
                  // basicPay: emp.basicPay,
                  // netEarnings: emp.netEarnings,
                  // pension: emp.pension,
                  // insurance: emp.insurance,
                  totalEarnings: emp.totalEarnings,
                  payeTax: emp.payeTax,
                  status: emp.status, // Default status
                })),
              });
          
              // console.log({ all });
            });
        
          await Promise.all(promises).then(()=> {
            res.status(200).json({
                status: 200,
                success: true,
                data: all,
                totalRecords: count,
                totalPages: Math.ceil(count / parseInt(limit)),
                currentPage: parseInt(page),
                limit: parseInt(limit)
            });
          })
        }

    } catch (error) {

        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })
    }
}
export default fetchPayrollPeriodDetails;