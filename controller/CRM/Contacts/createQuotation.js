import mongoose from 'mongoose';
import Quotation from '../../../model/Quotation';
import Contact from '../../../model/Contact';
import Employee from '../../../model/Employees';

// Create a new quotation and add it to a contact
export const createQuotation = async (req, res) => {
  const {
    contactId,
    contactName,
    currency,
    paymentTerms,
    expirationDate,
    itemDetails,
    total,
  } = req.body;

  let employee = await Employee.findOne({ _id: req.payload.id });

  if (!employee){
    return res.status(400).json({
        status: 400,
        error: 'Owner does not exist'
    })
}
  const newQuotation = new Quotation({
    companyId: req.payload.id,
    companyName: employee.companyName,
    contactId,
    contactName,
    currency,
    paymentTerms,
    expirationDate,
    itemDetails,
    total,
  });

  try {

    let contact = await Contact.findOne({ _id:  contactId });

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    const savedQuotation = await newQuotation.save();

    contact.quotations.push(savedQuotation);
    await contact.save();

    res.status(201).json(savedQuotation);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export default createQuotation;