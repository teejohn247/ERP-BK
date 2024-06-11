import dotenv from 'dotenv';
import Contact from '../../../model/Invoice';
import Company from '../../../model/Company';

dotenv.config();

const fetchInvoiceContact = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const company = await Company.findOne({ _id: req.payload.id });

    if (company) {
      const contacts = await Contact.find({ companyId: req.payload.id })
        .sort({ _id: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
      const count = await Contact.find({ companyId: req.payload.id }).countDocuments();

      res.status(200).json({
        status: 200,
        success: true,
        data: contacts,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      });
    } else {
      const contacts = await Contact.find({ owner: req.payload.id });

      res.status(200).json({
        status: 200,
        success: true,
        data: contacts
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
export default fetchInvoiceContact;