import mongoose from 'mongoose';
import Contact from '../../../model/Lead';
import Agent from '../../../model/Agent';


import Employee from '../../../model/Employees';


// Controller to add activity
const updateLead = async (req, res) => {
  let employee = await Employee.findOne({ _id: req.payload.id });

  const { leadId } = req.params;

try{
  const { 
    firstName,
    LastName,
    leadType,
    industry,
    leadPriority,
    leadScore,
    expectedRevenue,
    jobTitle,
    conversionProbability,
    leadOwner,
    leadOwnerId,
    assignedAgentId,
    assignedAgentName,
    source,
    description,
    location,
    } = req.body;

    let contact = await Contact.findOne({ _id: leadId });

    let agent = await Agent.findOne({ _id: assignedAgentId });

    if (!contact){
      return res.status(400).json({
          status: 400,
          error: 'lead does not exist'
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
      { _id: leadId },
      {
        firstName,
        LastName,
        leadType,
        industry,
        leadPriority,
        jobTitle,
        contactName: contact.fullName,
        leadScore,
        expectedRevenue,
        conversionProbability,
        leadOwner: employee.fullName,
        leadOwnerId,
        assignedAgentId,
        assignedAgentName,
        source,
        description,
        location
      },
    );

    if (!updatedContact) {
      return res.status(404).json({ status:404, success: false, message: 'Contact not found' });
    }


  // Return success response

  const updatedContactAgent = {
    'leads.$.leadId': updatedContact._id,
    'leads.$.fullName': updatedContact.fullName,
  };

  await Agent.findOneAndUpdate(
    { _id: assignedAgentId ? assignedAgentId : contact.assignedAgentId, 'leads.leadId': leadId },
    { $set: updatedContactAgent },
    { new: true }
  );
  res.status(201).json({ success: true, message: 'Lead created successfully', data: updatedContact});
}catch (error) {
  // Return error response
  console.error('Error creating contact:', error);
  res.status(500).json({ success: false, message: 'Failed to create contact', error: error.message });
};
}
 
// Export the controller function
export default updateLead;