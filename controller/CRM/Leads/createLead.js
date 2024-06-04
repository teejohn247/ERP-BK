// Import Mongoose model
import Contact from '../../../model/Contact';
import Department from '../../../model/Department';
import Company from '../../../model/Company';
import Employee from '../../../model/Employees';
import Agent from '../../../model/Agent';
import Lead from '../../../model/Lead';



// Define createContact controller function
const createLead = async (req, res) => {
  try {
    // Extract data from request body
    let employee = await Employee.findOne({ _id: req.payload.id });

    const { 
      firstName,
      LastName,
      leadType,
      industry,
      leadPriority,
      contactId,
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

      let contact = await Contact.findOne({ _id: contactId });

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
        contactId,
        leadScore,
        expectedRevenue,
        conversionProbability,
        leadOwner: employee.fullName,
        leadOwnerId,
        assignedAgentId,
        assignedAgentName: agent.fullName,
        source,
        description,
        tags,
        location
      });

    // Return success response
    const savedLead = await lead.save();

     await Agent.findOneAndUpdate(
      { _id: assignedAgentId },
      { $push: { leads: {
        leadId: savedLead._id,
        fullName: `${firstName} ${LastName}`,
        date: new Date().toISOString(),
      }} },
      { new: true }
    );
    res.status(201).json({ status:201, success: true, message: 'Lead created successfully', data: savedLead });
  } catch (error) {
    // Return error response
    console.error('Error creating contact:', error);
    res.status(500).json({status: 500, success: false, message: 'Failed to create contact', error: error.message });
  }
};

// Export the controller function
export default createLead;