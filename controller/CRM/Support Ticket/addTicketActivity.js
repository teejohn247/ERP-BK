import mongoose from 'mongoose';
import Contact from '../../../model/SupportTicket';

import Employee from '../../../model/Employees';


// Controller to add activity
const addTicketActivity= async (req, res) => {
  const { ticketId } = req.params;
  const { activityType, note  } = req.body;

  try {

    let employee = await Employee.findOne({ _id: req.payload.id });

    const contact = await Contact.findOne({ _id: ticketId})
    if (!contact) {
      return res.status(404).json({ status: 404, message: 'Ticket not found' });
    }

    const newActivity = {
        activityType,
        note,
        date: new Date(),
      };

      console.log({newActivity})
  
      const updatedContact = await Contact.findOneAndUpdate(
        { _id: ticketId },
        { $push: { activities: newActivity } },
        { new: true }
      );

      console.log({updatedContact})
  
      if (!updatedContact) {
        return res.status(404).json({ message: 'Ticket not found' });
      }
  
      res.status(201).json({ message: 'Activity added successfully', contact: updatedContact });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Export the controller function
export default addTicketActivity;