import Contact from '../../../model/Contact';


// Update contact controller function
const contactPicture = async (req, res) => {
  try {
    const { contactId } = req.params;


       // Extract data from request body
       let contact = await Contact.findOne({ _id: contactId });

       if (!contact){
         return res.status(400).json({
             status: 400,
             error: 'contact does not exist'
         })
     }
   
    

    // Find and update the contact
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: contactId },
      {
      profilePicture: req.body.image
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

export default contactPicture;