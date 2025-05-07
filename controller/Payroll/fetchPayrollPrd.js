import dotenv from 'dotenv';
import Payroll from '../../model/Payroll';
import PayrollPeriod from '../../model/PayrollPeriod';
import PeriodPayData from '../../model/PeriodPayData'
import Employee from '../../model/Employees';
import Company from '../../model/Company';


const sgMail = require('@sendgrid/mail')

dotenv.config();



sgMail.setApiKey(process.env.SENDGRID_KEY);



const fetchPayrollPrd = async (req, res) => {

    try {

        const { page = 1, limit = 10, search = '', status, startDate, endDate, sortBy = 'endDate', sortOrder = -1 } = req.query;


        // companyName: { type: String },
        // companyId: { type: String },
        // payrollPeriodName: { type: String },
        // description: { type: String },
        // startDate: { type: String },
        // endDate: { type: String },
        // reference: { type: String },
        // status: {type: String, default: 'Pending'},


        const comp =  await Company.findOne({_id: req.payload.id})
        const employee =  await Employee.findOne({_id: req.payload.id})


     if(comp){

        // Build match stage with filters
        const matchStage = { companyId: req.payload.id };
        
        // Add date filters if provided
        if (startDate && endDate) {
            matchStage['payrollPeriodData.startDate'] = { $gte: startDate };
            matchStage['payrollPeriodData.endDate'] = { $lte: endDate };
        } else if (startDate) {
            matchStage['payrollPeriodData.startDate'] = { $gte: startDate };
        } else if (endDate) {
            matchStage['payrollPeriodData.endDate'] = { $lte: endDate };
        }
        
        // Add status filter if provided
        if (status) {
            matchStage['payrollPeriodData.status'] = status;
        }
        
        // Add search functionality
        if (search) {
            matchStage.$or = [
                { 'payrollPeriodData.payrollPeriodName': { $regex: search, $options: 'i' } },
                { 'payrollPeriodData.reference': { $regex: search, $options: 'i' } }
            ];
        }

        // Create pipeline
        const aggregatePipeline = [
          {
            $match: {
              companyId: req.payload.id
            }
          },
          {
            $lookup: {
              from: 'payrollperiods', 
              localField: 'payrollPeriodId',
              foreignField: '_id',
              as: 'payrollPeriodData',
            },
          },
          {
            $unwind: '$payrollPeriodData', 
          }
        ];
        
        // Add additional match stage for filters
        if (Object.keys(matchStage).length > 1) {
          aggregatePipeline.push({
            $match: matchStage
          });
        }
        
        // Complete the pipeline with grouping
        aggregatePipeline.push(
          {
            $group: {
              _id: '$payrollPeriodId',
              payrollPeriodName: { $first: '$payrollPeriodData.payrollPeriodName' },
              startDate: { $first: '$payrollPeriodData.startDate' },
              endDate: { $first: '$payrollPeriodData.endDate' },
              reference: { $first: '$payrollPeriodData.reference' },
              status: { $first: '$payrollPeriodData.status' },
              totalEarnings: { $sum: { $add: ['$totalEarnings'] } },
              netEarnings: { $sum: '$netEarnings' },
              deductions: { $sum: { $add: ['$deductions'] } },
            },
          }
        );
        
        // Add sort stage
        const sortStage = {};
        sortStage[sortBy || 'endDate'] = parseInt(sortOrder) || -1;
        
        aggregatePipeline.push({ $sort: sortStage });
        
        // Get total count for pagination
        const countPipeline = [...aggregatePipeline];
        const totalData = await PeriodPayData.aggregate(countPipeline);
        const totalCount = totalData.length;
        
        // Add pagination stages
        aggregatePipeline.push(
          { $skip: (parseInt(page) - 1) * parseInt(limit) },
          { $limit: parseInt(limit) }
        );

        const totals = await PeriodPayData.aggregate(aggregatePipeline);

        console.log({totals})
      
        res.status(200).json({
          status: 200,
          success: true,
          data: totals,
          totalRecords: totalCount,
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          currentPage: parseInt(page),
          limit: parseInt(limit)
        });
        return
      }

      else if(employee){

        // Build match stage with filters
        const matchStage = { employeeId: req.payload.id };
        
        // Add date filters if provided
        if (startDate && endDate) {
            matchStage['payrollPeriodData.startDate'] = { $gte: startDate };
            matchStage['payrollPeriodData.endDate'] = { $lte: endDate };
        } else if (startDate) {
            matchStage['payrollPeriodData.startDate'] = { $gte: startDate };
        } else if (endDate) {
            matchStage['payrollPeriodData.endDate'] = { $lte: endDate };
        }
        
        // Add status filter if provided
        if (status) {
            matchStage['payrollPeriodData.status'] = status;
        }
        
        // Add search functionality
        if (search) {
            matchStage.$or = [
                { 'payrollPeriodData.payrollPeriodName': { $regex: search, $options: 'i' } },
                { 'payrollPeriodData.reference': { $regex: search, $options: 'i' } }
            ];
        }

        // Create pipeline
        const aggregatePipeline = [
          {
            $match: {
              employeeId: req.payload.id
            }
          },
          {
            $lookup: {
              from: 'payrollperiods', 
              localField: 'payrollPeriodId',
              foreignField: '_id',
              as: 'payrollPeriodData',
            },
          },
          {
            $unwind: '$payrollPeriodData', 
          }
        ];
        
        // Add additional match stage for filters
        if (Object.keys(matchStage).length > 1) {
          aggregatePipeline.push({
            $match: matchStage
          });
        }
        
        // Complete the pipeline with grouping
        aggregatePipeline.push(
          {
            $group: {
              _id: '$payrollPeriodId',
              payrollPeriodName: { $first: '$payrollPeriodData.payrollPeriodName' },
              startDate: { $first: '$payrollPeriodData.startDate' },
              endDate: { $first: '$payrollPeriodData.endDate' },
              reference: { $first: '$payrollPeriodData.reference' },
              status: { $first: '$payrollPeriodData.status' },
              totalEarnings: { $sum: { $add: ['$totalEarnings'] } },
              netEarnings: { $sum: '$netEarnings' },
              deductions: { $sum: { $add: ['$deductions'] } },
            },
          }
        );
        
        // Add sort stage
        const sortStage = {};
        sortStage[sortBy || 'endDate'] = parseInt(sortOrder) || -1;
        
        aggregatePipeline.push({ $sort: sortStage });
        
        // Get total count for pagination
        const countPipeline = [...aggregatePipeline];
        const totalData = await PeriodPayData.aggregate(countPipeline);
        const totalCount = totalData.length;
        
        // Add pagination stages
        aggregatePipeline.push(
          { $skip: (parseInt(page) - 1) * parseInt(limit) },
          { $limit: parseInt(limit) }
        );

        const totals = await PeriodPayData.aggregate(aggregatePipeline);

        console.log({totals})
      
        res.status(200).json({
          status: 200,
          success: true,
          data: totals,
          totalRecords: totalCount,
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          currentPage: parseInt(page),
          limit: parseInt(limit)
        });
        return
      }

        // const role = await Payroll.find({companyId: req.payload.id})
        // .sort({_id: -1})
        // .limit(limit * 1)
        // .skip((page - 1) * limit)
        // .exec();

        // const count = await Payroll.find({companyId: req.payload.id}).countDocuments()

        // console.log(role)

        // res.status(200).json({
        //     status: 200,
        //     success: true,
        //     data: role,
        //     totalPages: Math.ceil(count / limit),
        //     currentPage: page
        // });

    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })
    }
}
export default fetchPayrollPrd;



