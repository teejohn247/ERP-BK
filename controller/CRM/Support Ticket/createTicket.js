// Import Mongoose model
import Contact from '../../../model/Contact';
import SupportTicket from '../../../model/SupportTicket';

import Department from '../../../model/Department';
import Company from '../../../model/Company';
import Employee from '../../../model/Employees';
import Agent from '../../../model/Employees';


// Utility function to generate a unique ticket number
const generateTicketNumber = () => {
  const prefix = "TICKET-";
  const timestamp = Date.now(); // You can also use a more complex logic if needed
  return `${prefix}${timestamp}`;
};
// Define createContact controller function
const createTicket = async (req, res) => {
  try {

    const {
    title,
    contactId,
    ownerId,
    description,
    stage,
    status,
    priority,
    closureTime,
    associatedPO,
    source,
    tags,
    creationDate,
    associatedTicket,
    note,
    } = req.body;
        // Extract data from request body
        let employee = await Employee.findOne({ _id: ownerId });
      //   let agent = await Agent.findOne({ _id: ownerId });
      //   if (!agent){
      //     return res.status(400).json({
      //         status: 400,
      //         error: 'Owner does not exist'
      //     })
      // }

      let contact = await Contact.findOne({ _id: contactId });
    
      if (!contact){
        return res.status(400).json({
            status: 400,
            error: 'contact does not exist'
        })
      }

      const ticketNumber = generateTicketNumber();
    console.log(req.body.image)

    // Create new contact document
    const newSupportTicket = new SupportTicket({
      companyId: employee.companyId,
      companyName: employee.companyName,
      ticketNumber,
      title,
      description,
      contactName: contact.companyName,
      contactId,
      ownerId,
      ownerName: employee.fullName,
      stage,
      status,
      priority,
      closureTime,
      attachment: req.body.image,
      source,
      tags,
      creationDate: creationDate || new Date().toISOString(),
      associatedTicket,
      note,
    });

    // Save the contact to the database
    await newSupportTicket.save();

    await Agent.findOneAndUpdate(
      { _id: ownerId },
      { $push: { tickets: {
          ticketId: newSupportTicket._id,
          note: newSupportTicket.note,
          ticketNumber: newSupportTicket.ticketNumber,
          stage: newSupportTicket.stage,
          status:newSupportTicket.status,
          priority: newSupportTicket.priority,
          closureTime: newSupportTicket.closureTime,
          date: new Date().toISOString(),
      }} },
      { new: true }
    );

   

    // Return success response
    res.status(201).json({ success: true, message: 'Ticket created successfully', data: newSupportTicket});
  } catch (error) {
    // Return error response
    console.error('Error creating contact:', error);
    res.status(500).json({ success: false, message: 'Failed to create contact', error: error.message });
  }
};

// Export the controller function
export default createTicket;