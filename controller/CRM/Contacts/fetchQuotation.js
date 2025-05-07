import dotenv from 'dotenv';
import Contact from '../../../model/Quotation';
import Company from '../../../model/Company';

dotenv.config();

const fetchQuotation = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10,
      search = '',
      status,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      sortBy = 'createdAt',
      sortOrder = -1
    } = req.query;
    
    // Create sort object
    const sort = {};
    sort[sortBy] = parseInt(sortOrder) || -1;
    
    const company = await Company.findOne({ _id: req.payload.id });

    if (company) {
      // Build filter for quotations
      let filter = { contactId: req.params.id };
      
      // Add status filter if provided
      if (status) {
        filter.status = status;
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
      
      // Add amount range filters if provided
      if (minAmount || maxAmount) {
        filter.totalAmount = {};
        if (minAmount) filter.totalAmount.$gte = Number(minAmount);
        if (maxAmount) filter.totalAmount.$lte = Number(maxAmount);
      }
      
      // Add search functionality
      if (search) {
        filter.$or = [
          { quotationNumber: { $regex: search, $options: 'i' } },
          { title: { $regex: search, $options: 'i' } },
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
      // For employee users, just get the specific quotation
      let filter = { _id: req.params.id };
      
      // Add search and filters if applicable
      if (search || status || startDate || endDate || minAmount || maxAmount) {
        // Add search functionality
        if (search) {
          filter.$or = [
            { quotationNumber: { $regex: search, $options: 'i' } },
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { customerName: { $regex: search, $options: 'i' } }
          ];
        }
        
        // Add status filter if provided
        if (status) {
          filter.status = status;
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
        
        // Add amount range filters if provided
        if (minAmount || maxAmount) {
          filter.totalAmount = {};
          if (minAmount) filter.totalAmount.$gte = Number(minAmount);
          if (maxAmount) filter.totalAmount.$lte = Number(maxAmount);
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
        // No filters, just get the quotation by ID
        const contacts = await Contact.find(filter);

        res.status(200).json({
          status: 200,
          success: true,
          data: contacts,
          totalRecords: contacts.length,
          totalPages: 1,
          currentPage: 1,
          limit: contacts.length
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      error: error.message
    });
  }
};

export default fetchQuotation;
