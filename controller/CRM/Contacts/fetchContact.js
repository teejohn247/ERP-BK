import dotenv from 'dotenv';
import Contact from '../../../model/Contact';
import Company from '../../../model/Company';

dotenv.config();

const fetchContact = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10,
      search = '',
      status,
      contactType,
      industry,
      sortBy = 'createdAt',
      sortOrder = -1
    } = req.query;
    
    // Create sort object
    const sort = {};
    sort[sortBy] = parseInt(sortOrder) || -1;
    
    const company = await Company.findOne({ _id: req.payload.id });

    if (company) {
      // Build filter for company contacts
      let filter = { companyId: req.payload.id };
      
      // Add status filter if provided
      if (status) {
        filter.status = status;
      }
      
      // Add contactType filter if provided
      if (contactType) {
        filter.contactType = contactType;
      }
      
      // Add industry filter if provided
      if (industry) {
        filter.industry = industry;
      }
      
      // Add search functionality
      if (search) {
        filter.$or = [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { companyName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } }
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
      // For employee users, build filter for owned contacts
      let filter = { owner: req.payload.id };
      
      // Add search functionality
      if (search) {
        filter.$or = [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { companyName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } }
        ];
      }
      
      // Add status filter if provided
      if (status) {
        filter.status = status;
      }
      
      // Add contactType filter if provided
      if (contactType) {
        filter.contactType = contactType;
      }
      
      // Add industry filter if provided
      if (industry) {
        filter.industry = industry;
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

export default fetchContact;
