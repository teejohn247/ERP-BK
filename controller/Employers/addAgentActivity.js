import mongoose from 'mongoose';
import Contact from '../../model/Agent';

import Employee from '../../model/Employees';


// Controller to add activity
const addAgentActivity= async (req, res) => {
  const { agentId } = req.params;
  const { activityType, note  } = req.body;

  console.log(req.file.path)

  try {

    let employee = await Employee.findOne({ _id: req.payload.id });

    const contact = await Contact.findOne({ _id: agentId})
    if (!contact) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const newActivity = {
        activityType,
        note,
        date: new Date(),
      };

      console.log({newActivity})
  
      const updatedContact = await Contact.findOneAndUpdate(
        { _id: agentId },
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
export default addAgentActivity;