import mongoose from 'mongoose';
import Contact from '../../../model/Lead';
import Agent from '../../../model/Agent';


import Employee from '../../../model/Employees';


// Controller to add activity
const updateLead = async (req, res) => {
  let employee = await Employee.findOne({ _id: req.payload.id });
try{
  const { 
    firstName,
    LastName,
    leadType,
    industry,
    leadPriority,
    leadId,
    leadScore,
    expectedRevenue,
    conversionProbability,
    leadOwner,
    leadOwnerId,
    assignedAgentId,
    assignedAgentName,
    source,
    description,
    tags,
    location,
    } = req.body;

    let contact = await Contact.findOne({ _id: leadId });

    let agent = await Agent.findOne({ _id: assignedAgentId });

    if (!contact){
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

    const lead = new Lead({
      companyId: employee.companyId,
      companyName: employee.companyName,
      firstName,
      LastName,
      leadType,
      industry,
      leadPriority,
      contactName: contact.fullName,
      leadId,
      leadScore,
      expectedRevenue,
      conversionProbability,
      leadOwner: employee.fullName,
      leadOwnerId,
      assignedAgentId,
      assignedAgentName,
      source,
      description,
      tags,
      location
    });


    // Find and update the contact
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: leadId },
      {
        companyId: employee.companyId,
        companyName: employee.companyName,
        firstName,
        LastName,
        leadType,
        industry,
        leadPriority,
        contactName: contact.fullName,
        leadId,
        leadScore,
        expectedRevenue,
        conversionProbability,
        leadOwner: employee.fullName,
        leadOwnerId,
        assignedAgentId,
        assignedAgentName,
        source,
        description,
        tags,
        location
      },
    );

    if (!updatedContact) {
      return res.status(404).json({ status:404, success: false, message: 'Contact not found' });
    }


  // Return success response

  const updatedContactAgent = {
    'tickets.$.notes': updatedContact.notes,
    'tickets.$.ticketNumber': updatedContact.ticketNumber,
    'tickets.$.stage': updatedContact.stage,
    'tickets.$.status': updatedContact.status,
    'tickets.$.priority': updatedContact.priority,
    'tickets.$.closureTime': updatedContact.closureTime
  };


  // Find and update the agent's specific contact
  await Agent.findOneAndUpdate(
    { _id: assignedAgentId ? assignedAgentId : contact.assignedAgentId, 'tickets.ticketId': ticketId },
    { $set: updatedContactAgent },
    { new: true }
  );
  res.status(201).json({ success: true, message: 'Lead created successfully', data: savedLead });
}catch (error) {
  // Return error response
  console.error('Error creating contact:', error);
  res.status(500).json({ success: false, message: 'Failed to create contact', error: error.message });
};
}
 
// Export the controller function
export default updateLead;