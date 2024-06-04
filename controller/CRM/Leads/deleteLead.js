import Contact from '../../../model/Lead';
import Employee from '../../../model/Employees';
import Agent from '../../../model/Agent';

/// Delete contact controller function
const deleteLead = async (req, res) => {
    try {
      const { leadId } = req.params;
  
      const lead= await Contact.findOne({ _id: leadId });

      // Find and delete the contact
      const deletedContact = await Contact.findOneAndDelete({ _id: leadId });
  
      if (!deletedContact) {
        return res.status(404).json({ success: false, message: 'Lead not found' });
      }
  
      await Agent.findOneAndUpdate(
        { _id: lead.assignedAgentId },
        { $pull: { leads: { leadId } } },
        { new: true }
      );
      res.status(200).json({ status:200, success: true, message: 'Lead deleted successfully' });
    } catch (error) {
      console.error('Error deleting contact:', error);
      res.status(500).json({ status:500, success: false, message: 'Failed to delete Lead', error: error.message });
    }
  };
export default deleteLead;