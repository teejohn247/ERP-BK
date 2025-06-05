import dotenv from "dotenv";
import Role from "../../model/Role";
import Company from "../../model/Company";
import Leave from "../../model/Expense";
import Employee from "../../model/Employees";
import Expense from "../../model/Expense";
import ExpenseRequest from "../../model/ExpenseRequests";
import { emailTemp } from '../../emailTemplate';
import { sendEmail } from '../../config/email';
import moment from "moment";
const sgMail = require("@sendgrid/mail");

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_KEY);

const createExpenseRequest = async (req, res) => {
  console.log('Expense request body:', req.body);

  try {
    const { expenseTypeId, expenseDate, amount, description } = req.body;
    
    // Get image from middleware
    const attachment = req.body.image || null;

    if (!expenseTypeId || !expenseDate || !amount) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Missing required fields: expenseTypeId, expenseDate, amount"
      });
    }

    // Parse date from DD-MM-YYYY format
    let isoDate;
    try {
      const [day, month, year] = expenseDate.split('-');
      isoDate = new Date(`${year}-${month}-${day}`).toISOString();
      console.log('Parsed date:', isoDate);
    } catch (dateError) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Invalid date format. Please use DD-MM-YYYY format",
        error: dateError.message
      });
    }

    // Find expense type
    let expense = await Expense.findOne({ _id: expenseTypeId });
    if (!expense) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Expense type not found"
      });
    }

    // Find employee
    let employee = await Employee.findOne({ _id: req.payload.id });
    if (!employee) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Employee not found"
      });
    }

    // Find company
    let company = await Company.findOne({ _id: employee.companyId });
    console.log('Company found:', company ? company._id : 'None');

    // Find employee's manager
    const checkManager = await Employee.findOne({ _id: employee.managerId });
    if (!checkManager) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Manager not found"
      });
    }

    if (!company || !company.companyName) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "No company has been created for this account"
      });
    }

    if (Number(employee.expenseDetails?.cardLimit) === 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Card limit has not been set"
      });
    }

    if (Number(amount) > Number(employee.expenseDetails?.cardBalance)) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "This amount is greater than your card balance. Make a request to increase your limit"
      });
    }

    // Prepare employee data for the expense request
    let employeeData = {
      employeeName: employee.fullName,
      profilePic: employee.profilePic,
      department: employee.department,
      designationName: employee.designationName,
      managerName: employee.managerName
    };

    // Find approval settings
    const approvalSettings = employee.approvals?.filter(obj => obj.approvalType === "expense") || [];
    
    if (!approvalSettings.length) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "No expense approval settings found for this employee"
      });
    }

    // Create new expense request
    let expenseRequest = new ExpenseRequest({
      employeeId: req.payload.id,
      employeeName: employee.fullName ? employee.fullName : `${employee.firstName} ${employee.lastName}`,
      companyId: employee.companyId,
      companyName: employee.companyName,
      expenseTypeId,
      expenseTypeName: expense.expenseType,
      expenseDate: isoDate,
      attachment: attachment, // Using the attachment from cloudinary
      approver: approvalSettings[0].approval,
      approverId: approvalSettings[0].approvalId,
      amount,
      description,
      employeeDetails: employeeData
    });

    // Save expense request
    const savedExpenseRequest = await expenseRequest.save();
    
    if (!savedExpenseRequest) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Failed to save expense request"
      });
    }

    // Update employee expense history
    const history = await Employee.findOneAndUpdate(
      { _id: req.payload.id },
      {
        $push: {
          "expenseDetails.expenseHistory": {
            employeeId: req.payload.id,
            companyId: employee.companyId,
            companyName: employee.companyName,
            expenseTypeId,
            expenseTypeName: expense.expenseCardName || expense.expenseType,
            expenseDate: isoDate,
            attachment: attachment,
            approver: approvalSettings[0].approval,
            approverId: approvalSettings[0].approvalId,
            amount,
            description,
          },
        },
      },
      { new: true }
    );

    if (!history) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Error saving expense history"
      });
    }

    try {
      // Send email to manager
      let managerEmailContent = `<div>
        <p style="padding: 32px 0; text-align: left !important; font-weight: 700; font-size: 20px;font-family: 'DM Sans';">
        Hi,
        </p> 
        <p style="font-size: 16px; text-align: left !important; font-weight: 300;">
        ${employee.firstName ? employee.firstName : employee.fullName} has made an expense request. 
        Log in to your account to accept or reject.
        <br><br>
        </p>
      </div>`;

      let managerEmailTemplate = emailTemp(managerEmailContent, 'Expense Application Notification');
      const managerReceivers = [{ email: checkManager.email }];
      
      await sendEmail(
        req, 
        res, 
        checkManager.email, 
        managerReceivers, 
        'Expense Application Notification', 
        managerEmailTemplate
      );

      // Send email to employee
      let employeeEmailContent = `<div>
        <p style="padding: 32px 0; text-align: left !important; font-weight: 700; font-size: 20px;font-family: 'DM Sans';">
        Hi,
        </p> 
        <p style="font-size: 16px; text-align: left !important; font-weight: 300;">
        Your expense approver has received your expense request. 
        A decision would be made soon.
        <br><br>
        </p>
      </div>`;

      let employeeEmailTemplate = emailTemp(employeeEmailContent, 'Expense Application Notification');
      const employeeReceivers = [{ email: employee.email }];
      
      await sendEmail(
        req, 
        res, 
        employee.email, 
        employeeReceivers, 
        'Expense Application Notification', 
        employeeEmailTemplate
      );
    } catch (emailError) {
      console.error("Failed to send email notifications:", emailError);
      // Continue even if emails fail
    }

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Expense request created successfully",
      data: savedExpenseRequest
    });

  } catch (error) {
    console.error("Create expense request error:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Server error while creating expense request",
      error: error.message
    });
  }
};

export default createExpenseRequest;
