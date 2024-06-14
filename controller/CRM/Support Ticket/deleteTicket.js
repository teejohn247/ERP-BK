import Contact from '../../../model/SupportTicket';
import Employee from '../../../model/Employees';
import Agent from '../../../model/Employees';

/// Delete contact controller function
const deleteTicket = async (req, res) => {
    try {
      const { ticketId } = req.params;
  
      // Find and delete the contact
      const ticket= await Contact.findOneAndDelete({ _id: ticketId });

      const deletedContact = await Contact.findOneAndDelete({ _id: ticketId });
  
      if (!deletedContact) {
        return res.status(404).json({ success: false, message: 'Ticket not found' });
      }
  
      await Agent.findOneAndUpdate(
        { _id: ticket.assignedAgentId },
        { $pull: { tickets: { ticketId} } },
        { new: true }
      );
      res.status(200).json({ status:200, success: true, message: 'Ticket deleted successfully' });
    } catch (error) {
      console.error('Error deleting contact:', error);
      res.status(500).json({ status:500, success: false, message: 'Failed to delete Ticket', error: error.message });
    }
  };
export default deleteTicket;