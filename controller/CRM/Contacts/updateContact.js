import Contact from '../../../model/Contact';
import Employee from '../../../model/Employees';
import Agent from '../../../model/Employees';

// Update contact controller function
const updateContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    const {
      firstName,
      lastName,
      contactType,
      onboardingDate,
      industry,
      assignedAgentId,
      assignedAgentName,
      email,
      taxId,
      ownerId,
      ownerName,
      jobTitle,
      organization,
      jobRole,
      tags,
      personalEmail,
      location,
      phone,
      address,
      city,
      state,
      postalCode,
      country
    } = req.body;


       // Extract data from request body
       let employee = await Employee.findOne({ _id: ownerId });
       let contact = await Contact.findOne({ email });

       let agent = await Agent.findOne({ _id: assignedAgentId });

       if (!contact){
         return res.status(400).json({
             status: 400,
             error: 'contact does not exist'
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

    // Find and update the contact
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: contactId },
      {
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
      ownerId,
      ownerName: employee.fullName,
      jobTitle,
      organization,
      personalEmail,
      jobRole,
      tags,
      location,
      phone,
      address,
      city,
      state,
      postalCode,
      country
      },
    );

    if (!updatedContact) {
      return res.status(404).json({ status:404, success: false, message: 'Contact not found' });
    }

    const updatedContactAgent = {
      'contacts.$.fullName': `${firstName} ${lastName}`,
      'contacts.$.date': new Date().toISOString(),
    };

    // Find and update the agent's specific contact
    await Agent.findOneAndUpdate(
      { _id: assignedAgentId, 'contacts.contactId': contactId },
      { $set: updatedContactAgent },
      { new: true }
    );

    res.status(200).json({ status:200, success: true, message: 'Contact updated successfully'});
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ status:500, success: false, message: 'Failed to update contact', error: error.message });
  }
};

export default updateContact;