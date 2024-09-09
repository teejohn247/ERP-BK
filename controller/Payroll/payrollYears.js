import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Company from '../../model/Company';
import PeriodPayData from '../../model/PeriodPayData';

dotenv.config();

const payrollYears = async (req, res) => {
  try {
    const companyId = req.payload.id;

    // Find the company by ID
    const company = await Company.findOne({ _id: companyId });

    // If the company is not found or has no companyName, return an error
    if (!company || !company.companyName) {
      return res.status(400).json({
        status: 400,
        error: 'No company has been created for this account',
      });
    }


    const yearsWithData = await PeriodPayData.aggregate([
      {
        $match: { companyId }, // Match records by companyId (as a string)
      },
      {
        $group: {
          _id: { $year: '$createdAt' }, // Group by the year of the createdAt field
          totalEarnings: { $sum: '$totalEarnings' }, // Sum the total earnings
        },
      },
      {
        $match: {
          totalEarnings: { $gt: 0 }, // Filter to include only years with earnings greater than 0
        },
      },
      {
        $project: {
          year: '$_id', // Rename _id to year
          _id: 0, // Exclude _id
        },
      },
      {
        $sort: { year: 1 }, // Sort years in ascending order
      },
    ]);

    console.log({yearsWithData})

    // If no years are found, return an appropriate response
    if (yearsWithData.length === 0) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'No data found for any years.',
      });
    }

    // Extract the years from the results
    const years = yearsWithData.map((yearObj) => yearObj.year);

    // Return the list of years that have data
    return res.status(200).json({
      status: 200,
      success: true,
      data: years, // Array of years with data
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      error: error.message,
    });
  }
};

export default payrollYears;
