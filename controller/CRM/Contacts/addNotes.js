import mongoose from 'mongoose';
import Contact from '../../../model/Contact';

import Employee from '../../../model/Employees';


// Controller to add activity
const addNotes = async (req, res) => {
  const { contactId } = req.params;
  const { activityType, note, priority, attachment } = req.body;


  try {

    let employee = await Employee.findOne({ _id: req.payload.id });

    const contact = await Contact.findOne({ _id: contactId})
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    const newActivity = {
        note,
        attachment: req?.file ? req.file.path : '',
        priority,
        date: new Date(),
      };

      console.log({newActivity})
  
      const updatedContact = await Contact.findOneAndUpdate(
        { _id: contactId },
        { $push: { notes: newActivity } },
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
export default addNotes;