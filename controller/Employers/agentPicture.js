import Contact from '../../model/Agent';


// Update contact controller function
const agentPicture = async (req, res) => {
  try {
    const { agentId } = req.params;


       // Extract data from request body
       let contact = await Contact.findOne({ _id: agentId});

       if (!contact){
         return res.status(400).json({
             status: 400,
             error: 'contact does not exist'
         })
     }
   
    // Find and update the contact
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: agentId },
      {
      profilePicture: req.body.image
      },
    );

    if (!updatedContact) {
      return res.status(404).json({ status:404, success: false, message: 'agentnot found' });
    }

    res.status(200).json({ status:200, success: true, message: 'Agent updated successfully'});
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ status:500, success: false, message: 'Failed to update contact', error: error.message });
  }
};

export default agentPicture;