import dotenv from 'dotenv';
import Contact from '../../../model/SupportTicket';
import Company from '../../../model/Company';

dotenv.config();

const fetchTicket = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10,
      search = '',
      status,
      priority,
      category,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = -1
    } = req.query;
    
    // Create sort object
    const sort = {};
    sort[sortBy] = parseInt(sortOrder) || -1;
    
    const company = await Company.findOne({ _id: req.payload.id });

    if (company) {
      // Build filter for company tickets
      let filter = { companyId: req.payload.id };
      
      // Add status filter if provided
      if (status) {
        filter.status = status;
      }
      
      // Add priority filter if provided
      if (priority) {
        filter.priority = priority;
      }
      
      // Add category filter if provided
      if (category) {
        filter.category = category;
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
          { ticketNumber: { $regex: search, $options: 'i' } },
          { subject: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { customerName: { $regex: search, $options: 'i' } }
        ];
      }
      
      // Get count for pagination
      const count = await Contact.find(filter).countDocuments();
      
      const contacts = await Contact.find(filter)
        .sort(sort)
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit))
        .exec();

      res.status(200).json({
        status: 200,
        success: true,
        data: contacts,
        totalRecords: count,
        totalPages: Math.ceil(count / parseInt(limit)),
        currentPage: parseInt(page),
        limit: parseInt(limit)
      });
    } else {
      // For employee users, build filter for owned tickets
      let filter = { owner: req.payload.id };
      
      // Add status filter if provided
      if (status) {
        filter.status = status;
      }
      
      // Add priority filter if provided
      if (priority) {
        filter.priority = priority;
      }
      
      // Add category filter if provided
      if (category) {
        filter.category = category;
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
          { ticketNumber: { $regex: search, $options: 'i' } },
          { subject: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { customerName: { $regex: search, $options: 'i' } }
        ];
      }
      
      // Get count for pagination
      const count = await Contact.find(filter).countDocuments();
      
      const contacts = await Contact.find(filter)
        .sort(sort)
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit))
        .exec();

      res.status(200).json({
        status: 200,
        success: true,
        data: contacts,
        totalRecords: count,
        totalPages: Math.ceil(count / parseInt(limit)),
        currentPage: parseInt(page),
        limit: parseInt(limit)
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      error: error.message
    });
  }
};

export default fetchTicket;
