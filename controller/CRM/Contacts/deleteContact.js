import Contact from '../../../model/Contact';
import Employee from '../../../model/Employees';
import Agent from '../../../model/Employees';

/// Delete contact controller function
const deleteContact = async (req, res) => {
    try {
      const { contactId } = req.params;
  
      // Find and delete the contact

      const contact = await Contact.findOne({ _id: contactId });

      const deletedContact = await Contact.findOneAndDelete({ _id: contactId });
  
      if (!deletedContact) {
        return res.status(404).json({ success: false, message: 'Contact not found' });
      }

         // Find and update the agent, pulling the contact from the contacts array
        await Agent.findOneAndUpdate(
          { _id: contact.assignedAgentId },
          { $pull: { contacts: { contactId } } },
          { new: true }
        );

  
      res.status(200).json({ status:200, success: true, message: 'Contact deleted successfully' });
    } catch (error) {
      console.error('Error deleting contact:', error);
      res.status(500).json({ status:500, success: false, message: 'Failed to delete contact', error: error.message });
    }
  };
export default deleteContact;