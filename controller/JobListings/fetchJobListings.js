import dotenv from 'dotenv';
import JobPost from '../../model/JobPost';





const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const fetchJobListings = async (req, res) => {

    try {

        const { 
            page = 1, 
            limit = 10, 
            search = '',
            status,
            department,
            startDate,
            endDate,
            sortBy = 'createdAt',
            sortOrder = -1
        } = req.query;

        // Build filter object
        let filter = { companyId: req.payload.id };
        
        // Add status filter if provided
        if (status) {
            filter.status = status;
        }
        
        // Add department filter if provided
        if (department) {
            filter.department = department;
        }
        
        // Add date range filters if provided
        if (startDate && endDate) {
            filter.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        } else if (startDate) {
            filter.createdAt = { $gte: new Date(startDate) };
        } else if (endDate) {
            filter.createdAt = { $lte: new Date(endDate) };
        }
        
        // Add search functionality
        if (search) {
            filter.$or = [
                { jobTitle: { $regex: search, $options: 'i' } },
                { jobDescription: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Create sort object
        const sort = {};
        sort[sortBy] = parseInt(sortOrder) || -1;
        
        // Get count for pagination
        const count = await JobPost.find(filter).countDocuments();

        const jobListing = await JobPost.find(filter)
            .sort(sort)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .exec();

        res.status(200).json({
            status: 200,
            success: true,
            data: jobListing,
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
export default fetchJobListings;



