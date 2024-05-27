// Import Mongoose model
import Contact from '../../../model/Lead';
import Department from '../../../model/Department';
import Company from '../../../model/Company';
import Employee from '../../../model/Employees';


// Define createContact controller function
const createLead = async (req, res) => {
  try {
    // Extract data from request body
    let employee = await Employee.findOne({ _id: req.payload.id });

    const {
      name,
      email,
      taxId,
      jobTitle,
      organization,
      buyingRole,
      tags,
      location,
      contacts,
    } = req.body;

    // Create new contact document
    const newContact = new Contact({
      companyId: employee.companyId,
      companyName: employee.companyName,
      name,
      email,
      taxId,
      owner: req.payload.id,
      jobTitle,
      organization,
      buyingRole,
      tags,
      location,
      contacts,
    });

    // Save the contact to the database
    await newContact.save();

    // Return success response
    res.status(201).json({ success: true, message: 'Contact created successfully', data: newContact });
  } catch (error) {
    // Return error response
    console.error('Error creating contact:', error);
    res.status(500).json({ success: false, message: 'Failed to create contact', error: error.message });
  }
};

// Export the controller function
export default createLead;