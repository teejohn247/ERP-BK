// Import Mongoose model
import Contact from '../../../model/Contact';
import Department from '../../../model/Department';
import Company from '../../../model/Company';
import Employee from '../../../model/Employees';
import Agent from '../../../model/Agent'


// Define createContact controller function
const createContact = async (req, res) => {
  try {

    const {
      name,
      email,
      taxId,
      jobTitle,
      organization,
      buyingRole,
      ownerId,
      tags,
      location,
      contacts,
    } = req.body;
        // Extract data from request body
        let employee = await Employee.findOne({ _id: req.payload.id });
        let agent = await Agent.findOne({ _id: ownerId });
    
        if (!agent){
          return res.status(400).json({
              status: 400,
              error: 'Agent does not exist'
          })
         
      }
    

    // Create new contact document
    const newContact = new Contact({
      companyId: employee.companyId,
      companyName: employee.companyName,
      name,
      email,
      taxId,
      ownerId,
      ownerName: agent.fullName,
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
export default createContact;