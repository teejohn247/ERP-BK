import mongoose from 'mongoose';
import Contact from '../../../model/Lead';

import Employee from '../../../model/Employees';


// Controller to add activity
const addLeadActivity = async (req, res) => {
  const { leadId } = req.params;
  const { activityType, note, attachment,activityDateTime, 
    priority} = req.body;


  try {

    let employee = await Employee.findOne({ _id: req.payload.id });

    const contact = await Contact.findOne({ _id: leadId})
    if (!contact) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const newActivity = {
        activityType,
        note,
        activityDateTime, 
        priority,
        date: new Date(),
      };

      console.log({newActivity})
  
      const updatedContact = await Contact.findOneAndUpdate(
        { _id: leadId },
        { $push: { activities: newActivity } },
        { new: true }
      );

      console.log({updatedContact})
  
      if (!updatedContact) {
        return res.status(404).json({ message: 'Lead not found' });
      }
  
      res.status(201).json({ message: 'Activity added successfully', contact: updatedContact });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Export the controller function
export default addLeadActivity;