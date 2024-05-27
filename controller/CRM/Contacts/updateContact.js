import Contact from '../../../model/Contact';
import Employee from '../../../model/Employees';
import Agent from '../../../model/Agent';

// Update contact controller function
const updateContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    const {
      name,
      email,
      taxId,
      jobTitle,
      organization,
      buyingRole,
      ownerId,
      tags,
      location,
      contacts,
    } = req.body;

    // Validate if the owner exists
    let agent = await Agent.findOne({ _id: ownerId });
    if (!agent) {
      return res.status(400).json({
        status: 400,
        error: 'Agent does not exist'
      });
    }

    // Find and update the contact
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: contactId },
      {
        name: name && name,
        email: email && email,
        taxId: taxId && taxId,
        jobTitle: jobTitle && jobTitle,
        organization: organization && organization,
        buyingRole: buyingRole && buyingRole,
        ownerId: ownerId && ownerId,
        ownerName: agent && agent.fullName,
        tags: tags && tags,
        location: location && location,
        contacts: contacts && contacts,
      },
    );

    if (!updatedContact) {
      return res.status(404).json({ status:404, success: false, message: 'Contact not found' });
    }

    res.status(200).json({ status:200, success: true, message: 'Contact updated successfully'});
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ status:500, success: false, message: 'Failed to update contact', error: error.message });
  }
};

export default updateContact;