import dotenv from "dotenv";
import Employee from "../../model/Employees";
import Department from "../../model/Department";
import Designation from "../../model/Designation";

import Company from "../../model/Company";
import AuditTrail from "../../model/AuditTrail";
import LeaveRecords from "../../model/LeaveRecords";
import Expense from "../../model/Expense";


dotenv.config();

const deleteCompany = async (req, res) => {
  try {
    let company = await Company.find({ _id: req.payload.id });

    if (!company) {
      res.status(400).json({
        status: 400,
        error: "Company not found",
      });
      return;
    }

    Company.remove({ _id: req.payload.id }, async function (err, result) {
      console.log(result);

      if (err) {
        res.status(401).json({
          status: 401,
          success: false,
          error: err,
        });
      } else {
          await Employee.deleteMany({ companyId: req.payload.id }),
          await Department.deleteMany({ companyId: req.payload.id }),
          await Designation.deleteMany({ companyId: req.payload.id }),
          await LeaveRecords.deleteMany({ companyId: req.payload.id }),
          await Expense.deleteMany({ companyId: req.payload.id }),


          res.status(200).json({
            status: 200,
            success: true,
            data: "Company Deleted successfully!",
          });
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      error: error,
    });
  }
};
export default deleteCompany;
