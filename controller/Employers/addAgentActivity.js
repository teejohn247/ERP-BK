import mongoose from 'mongoose';
import Contact from '../../model/Employees';

import Employee from '../../model/Employees';


// Controller to add activity
const addAgentActivity= async (req, res) => {
  const { agentId } = req.params;
  const { activityType, note  } = req.body;

  try {
    // Validate required fields
    if (!activityType || !note) {
      return res.status(400).json({
        status: 400,
        success: false,
        error: 'Activity type and note are required'
      });
    }

    // Check if file exists in request
    const filePath = req.file ? req.file.path : null;
    if (filePath) {
      console.log(filePath);
    }

    let employee = await Employee.findOne({ _id: req.payload.id });
    if (!employee) {
      return res.status(404).json({
        status: 404,
        success: false,
        error: 'Employee not found'
      });
    }

    const contact = await Contact.findOne({ _id: agentId });
    if (!contact) {
      return res.status(404).json({
        status: 404,
        success: false,
        error: 'Agent not found'
      });
    }

    const newActivity = {
      activityType,
      note,
      date: new Date(),
      addedBy: req.payload.id,
      filePath: filePath || ''
    };

    console.log({newActivity});
  
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: agentId },
      { $push: { activities: newActivity } },
      { new: true }
    );

    console.log({updatedContact});
  
    if (!updatedContact) {
      return res.status(404).json({
        status: 404,
        success: false,
        error: 'Failed to update agent with activity'
      });
    }
  
    // Get the newest activity (the one just added)
    const addedActivity = updatedContact.activities[updatedContact.activities.length - 1];
    
    // Return consistent response format
    res.status(201).json({
      status: 201,
      success: true,
      data: addedActivity,
      message: 'Activity added successfully'
    });
  } catch (error) {
    console.error('Error adding agent activity:', error);
    res.status(500).json({
      status: 500,
      success: false,
      error: error.message || 'Server error while adding activity'
    });
  }
};

// Export the controller function
export default addAgentActivity;