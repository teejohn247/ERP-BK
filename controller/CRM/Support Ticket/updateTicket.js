// Import Mongoose model
import Contact from '../../../model/Contact';
import SupportTicket from '../../../model/SupportTicket';
import Employee from '../../../model/Employees';
import Agent from '../../../model/Employees';

// Update contact controller function
const updateTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const {
      title,
    contactId,
    ownerId,
    stage,
    status,
    priority,
    closureTime,
    source,
    tags,
    creationDate,
    associatedTicket,
    note,
    } = req.body;

    let employee = await Employee.findOne({ _id: ownerId });
    let agent = await Agent.findOne({ _id: ownerId });



    if (!employee){
      return res.status(400).json({
          status: 400,
          error: 'Owner does not exist'
      })
     
  }

  let contact = await Contact.findOne({ _id: contactId });

  if (!contact){
    return res.status(400).json({
        status: 400,
        error: 'contact does not exist'
    })
  }


    // Find and update the contact
  //  

   SupportTicket.findOneAndUpdate(
      { _id: ticketId },{
      $set: { 
        title: title && title,
        contactId: contactId && contactId,
        ownerId:ownerId && ownerId ,
        ownerName: employee.fullName && employee.fullName,
        stage: stage && stage,
        status: status && status,
        priority: priority && priority,
        closureTime: closureTime && closureTime,
        source: source && source,
        tags: tags && tags,
        associatedTicket: associatedTicket && associatedTicket,
        note: note && note
      }
  },
      function (
          err,
          result
      ) {
          if (err) {
              res.status(401).json({
                  status: 401,
                  success: false,
                  error: err

              })

          } else {
              console.log({result})
              res.status(200).json({
                  status: 200,
                  success: true,
                  data: result
              })

          }
        
      })  

    // console.log({updatedContact})

    // if (!updatedContact) {
    //   return res.status(404).json({ status:404, success: false, message: 'Contact not found' });
    // }


    // const updatedContactAgent = {
    //   'tickets.$.notes': updatedContact.notes,
    //   'tickets.$.ticketNumber': updatedContact.ticketNumber,
    //   'tickets.$.stage': updatedContact.stage,
    //   'tickets.$.status': updatedContact.status,
    //   'tickets.$.priority': updatedContact.priority,
    //   'tickets.$.closureTime': updatedContact.closureTime
    // };


    // // Find and update the agent's specific contact
    // await Agent.findOneAndUpdate(
    //   { _id: ownerId ? ownerId : contact.ownerId, 'tickets.ticketId': ticketId },
    //   { $set: updatedContactAgent },
    //   { new: true }
    // );

    // res.status(200).json({ status:200, success: true, message: 'Contact updated successfully'});
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ status:500, success: false, message: 'Failed to update contact', error: error.message });
  }
};

export default updateTicket;