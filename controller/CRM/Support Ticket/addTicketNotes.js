import mongoose from 'mongoose';
import Contact from '../../../model/SupportTicket';
import Employee from '../../../model/Employees';


// Controller to add activity
const addTicketNotes = async (req, res) => {
  const { ticketId } = req.params;
  const { activityType, note, attachment } = req.body;


  try {

    let employee = await Employee.findOne({ _id: req.payload.id });

    const contact = await Contact.findOne({ _id: ticketId})
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    const newActivity = {
        note,
        attachment: req?.file ? req.file.path : '',
        date: new Date(),
      };

      console.log({newActivity})
  
      const updatedContact = await Contact.findOneAndUpdate(
        { _id: ticketId },
        { $push: { notes: newActivity } },
        { new: true }
      );

      console.log({updatedContact})
  
      if (!updatedContact) {
        return res.status(404).json({ message: 'Ticket not found' });
      }
  
      res.status(201).json({ message: 'Note added successfully', contact: updatedContact });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Export the controller function
export default addTicketNotes;