// Import Mongoose model
import Contact from '../../../model/Contact';
import Department from '../../../model/Department';
import Company from '../../../model/Company';
import Employee from '../../../model/Employees';
import Agent from '../../../model/Employees'


// Define createContact controller function
const createContact = async (req, res) => {
  try {

    const {
      firstName,
      lastName,
      contactType,
      onboardingDate,
      industry,
      assignedAgentId,
      assignedAgentName,
      email,
      contactOwnerId,
      personalEmail,
      ownerName,
      jobTitle,
      organization,
      jobRole,
      tags,
      location,
      phoneNumber,
      address,
      city,
      state,
      postalCode,
      country
    } = req.body;
        // Extract data from request body
        let employee = await Employee.findOne({ _id: contactOwnerId});
        let contact = await Contact.findOne({ email });


        let agent = await Agent.findOne({ _id: assignedAgentId });

        if (contact){
          return res.status(400).json({
              status: 400,
              error: 'contact already exist'
          })
      }
    
        if (!agent){
          return res.status(400).json({
              status: 400,
              error: 'Agent does not exist'
          })
         
      }

      if (!employee){
        return res.status(400).json({
            status: 400,
            error: 'Owner does not exist'
        })
    }
    

    // Create new contact document
    const newContact = new Contact({
      companyId: employee.companyId,
      companyName: employee.companyName,
      firstName,
      lastName,
      contactType,
      onboardingDate,
      industry,
      assignedAgentId,
      assignedAgentName: agent.fullName,
      email,
      contactOwnerId,
      ownerName: employee.fullName,
      jobTitle,
      organization,
      personalEmail,
      jobRole,
      tags,
      location,
      phoneNumber,
      address,
      city,
      state,
      postalCode,
      country
    });

    // Save the contact to the database
    await newContact.save();


    await Agent.findOneAndUpdate(
      { _id: assignedAgentId },
      { $push: { contacts: {
        contactId: newContact._id,
        fullName: `${firstName} ${lastName}`,
        date: new Date().toISOString(),
      }} },
      { new: true }
    );

    // Return success response
    res.status(200).json({ success: true, message: 'Contact created successfully', data: newContact });
  } catch (error) {
    // Return error response
    console.error('Error creating contact:', error);
    res.status(500).json({ status:500, success: false, message: 'Failed to create contact', error: error.message });
  }
};

// Export the controller function
export default createContact;