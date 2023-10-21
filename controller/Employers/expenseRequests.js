import dotenv from "dotenv";
import Role from "../../model/Role";
import Company from "../../model/Company";
import Leave from "../../model/Expense";
import Employee from "../../model/Employees";
import Expense from "../../model/Expense";
import ExpenseRequest from "../../model/ExpenseRequests";

const sgMail = require("@sendgrid/mail");

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_KEY);

const createExpenseRequest = async (req, res) => {
  try {
    const { expenseTypeId, expenseDate, amount, image, description } =
      req.body;


    let expense = await Expense.findOne({ _id: expenseTypeId });
    let employee = await Employee.findOne({ _id: req.payload.id });
    let company = await Company.findOne({ _id: employee.companyId });

    console.log({expense})


    if (!company.companyName) {
      res.status(400).json({
        status: 400,
        error: "No company has been created for this account",
      });
      return;
    }
 

    if (
      Number(employee.expenseDetails.cardLimit) == 0 
    ) {
      res.status(400).json({
        status: 400,
        error: "Card limit has not been set",
      });
      return;
    }

    if (Number(amount) > Number(employee.expenseDetails.cardBalance)) {
      res.status(400).json({
        status: 400,
        error:
          "This amount is greater than your card balance. Make a request to increase your limit",
      });
      return;
    }

    console.log('here')
    const approve = employee.approvals.filter(obj => obj.approvalType === "reimbursement");

    console.log({approve})

    let expenseRequest = new ExpenseRequest({
      employeeId: req.payload.id,
      employeeName: employee.fullName ? employee.fullName : `${employee.firstName} ${employee.lastName}`,
      companyId: employee.companyId,
      companyName: employee.companyName,
      expenseTypeId,
      expenseTypeName: expense.expenseCardName,
      expenseDate,
      attachment: image,
      approver: approve[0].approval,
      approverId: approve[0].approvalId,
      amount,
      image,
      description,
    });

    await expenseRequest
      .save()
      .then((adm) => {
        console.log(adm);

        Employee.findOneAndUpdate(
          { _id: req.payload.id },
          {
            $set: {
              "expenseDetails.cardBalance":
                Number(employee.expenseDetails.cardBalance) - Number(amount),
              "expenseDetails.totalSpent":
                Number(employee.expenseDetails.totalSpent) + Number(amount),
              "expenseDetails.currentSpent": Number(amount),
              "expenseDetails.currentExpense":
                Number(employee.expenseDetails.currentExpense) + Number(amount),
            },
          },
          async function (err, result) {
            if (err) {
              res.status(401).json({
                status: 401,
                success: false,
                error: err,
              });

              return;
            } else {
              const history = await Employee.findOneAndUpdate(
                { _id: req.payload.id },
                {
                  $push: {
                    "expenseDetails.expenseHistory": {

                        employeeId: req.payload.id,
                        companyId: employee.companyId,
                        companyName: employee.companyName,
                        expenseTypeId,
                        expenseTypeName: expense.expenseCardName,
                        expenseDate,
                        attachment: image,
                        approver: approve[0].approval,
                        approverId: approve[0].approvalId,
                        amount,
                        image,
                        description,
                    },
                  },
                }
              );

              console.log({ history });
              if (history) {
                res.status(200).json({
                  status: 200,
                  success: true,
                  data: history
                });
                return;
              } else {
                res.status(400).json({
                  status: 400,
                  error: "error saving expense history",
                });
                return;
              }
            }
          }
        );
        
      })
      .catch((err) => {
        console.error(err);
        res.status(400).json({
          status: 400,
          success: false,
          error: err,
        });
      });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      error: error,
    });
  }
};
export default createExpenseRequest;
