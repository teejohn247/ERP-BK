import mongoose from 'mongoose';
import Quotation from '../../../model/PurchaseOrder';
import Contact from '../../../model/Contact';
import Employee from '../../../model/Employees';
import Company from '../../../model/Company';


// Create a new quotation and add it to a contact
export const createPurchaseOrder = async (req, res) => {
  const {
    contactId,
    contactName,
    currency,
    paymentTerms,
    dateRequested,
    issuedDate,
    deliveryDate,
    associatedQuotation,
    expirationDate,
    itemDetails,
    total,
  } = req.body;

  let employee = await Employee.findOne({ _id: req.payload.id });
  let company = await Company.findOne({ _id: req.payload.id });


  if (!employee && !company){
    return res.status(400).json({
        status: 400,
        error: 'Owner does not exist'
    })
}

if(employee){

  const newQuotation = new Quotation({
    companyId: employee.companyId,
    companyName: employee.companyName,
    contactId,
    contactName,
    currency,
    paymentTerms,
    expirationDate,
    dateRequested,
    issuedDate,
    deliveryDate,
    associatedQuotation,
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
} else if(company){
  const newQuotation = new Quotation({
    companyId: req.payload.id,
    companyName: company.companyName,
    contactId,
    contactName,
    currency,
    paymentTerms,
    dateRequested,
    expirationDate,
    issuedDate,
    deliveryDate,
    associatedQuotation,
    itemDetails,
    total,
  });

  try {

    let contact = await Contact.findOne({ _id:  contactId });

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    const savedQuotation = await newQuotation.save();

    contact.purchaseOrders.push(savedQuotation);
    await contact.save();

    res.status(201).json(savedQuotation);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}
}


export default createPurchaseOrder;