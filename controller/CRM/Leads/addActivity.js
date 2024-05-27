import mongoose from 'mongoose';
import Contact from '../../../model/Contact';

import Employee from '../../../model/Employees';


// Controller to add activity
const addActivity = async (req, res) => {
  const { contactId } = req.params;
  const { activityType, note, attachment } = req.body;

  console.log(req.file.path)

  try {

    let employee = await Employee.findOne({ _id: req.payload.id });

    const contact = await Contact.findOne({ _id: contactId})
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    const newActivity = {
        activityType,
        note,
        attachment: req?.file ? req.file.path : '',
        date: new Date(),
      };

      console.log({newActivity})
  
      const updatedContact = await Contact.findOneAndUpdate(
        { _id: contactId },
        { $push: { activities: newActivity } },
        { new: true }
      );

      console.log({updatedContact})
  
      if (!updatedContact) {
        return res.status(404).json({ message: 'Contact not found' });
      }
  
      res.status(201).json({ message: 'Activity added successfully', contact: updatedContact });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Export the controller function
export default addActivity;