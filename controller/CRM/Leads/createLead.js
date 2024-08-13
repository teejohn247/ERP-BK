// Import Mongoose model
import Contact from '../../../model/Contact';
import Department from '../../../model/Department';
import Company from '../../../model/Company';
import Employee from '../../../model/Employees';
import Agent from '../../../model/Employees';
import Lead from '../../../model/Lead';



// Define createContact controller function
const createLead = async (req, res) => {
  try {
    // Extract data from request body
  
    const { 
      firstName,
      lastName,
      leadType,
      industry,
      leadPriority,
      jobTitle,
     
      leadScore,
      expectedRevenue,
      conversionProbability,
      leadOwner,
      contactOwnerId,
      assignedAgentId,
      onboardingDate,
      jobRole,
      address,
      city,
      state,
      country,
      postCode,
     email,
     phoneNumber,
      officeLocation,
      assignedAgentName,
      source,
      description,
      location,
      } = req.body;

      // address: { type: String },
      // city: { type: String },
      // state: { type: String },
      // country: { type: String },
      // postCode: { type: String },
      // officeLocation: { type: String },
  

      let employee = await Employee.findOne({ _id: contactOwnerId});

      console.log({employee})

      // let contact = await Contact.findOne({ _id: contactId });
      let agent = await Agent.findOne({ _id: assignedAgentId });

    //   if (!contact){
    //     return res.status(400).json({
    //         status: 400,
    //         error: 'contact does not exist'
    //     })
    // }
  
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
        lastName,
        email,
        leadType,
        phoneNumber,
        industry,
        jobRole,
        address,
        city,
        state,
        country,
        postCode,
        jobTitle,
        leadPriority,
        onboardingDate,
        officeLocation,
        // contactType,
        // contactName: contact.fullName,
        profilePic: req.body.image,
        // contactId,
        leadScore,
        expectedRevenue,
        conversionProbability,
        contactOwner: employee.fullName,
        contactOwnerId:contactOwnerId,
        assignedAgentId,
        assignedAgentName: agent.fullName,
        source,
        description,
        location
      });

    // Return success response
    const savedLead = await lead.save();

     await Agent.findOneAndUpdate(
      { _id: assignedAgentId },
      { $push: { leads: {
        leadId: savedLead._id,
        fullName: `${firstName} ${lastName}`,
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