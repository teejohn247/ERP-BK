import dotenv from "dotenv";
import Company from "../../model/Company";
import Designation from "../../model/Designation";
import Leave from "../../model/Leaves";
import Expense from "../../model/Expense";
import Employee from "../../model/Employees";



const sgMail = require("@sendgrid/mail");

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_KEY);

const updateDesignation = async (req, res) => {
  try {
    const { designationName, description, leaveAssignment, expenseCard } = req.body;

    let company = await Company.findOne({ _id: req.payload.id });

    let designation = await Designation.findOne({
      companyId: company._id,
      designationName: designationName,
    });

    console.log({ company });

    if (!company.companyName) {
      res.status(400).json({
        status: 400,
        error: "No company has been created for this account",
      });
      return;
    }

    // if (designation) {
    //   res.status(400).json({
    //     status: 400,
    //     error: "This designation name already exist",
    //   });
    //   return;
    // }

    if (!leaveAssignment) {


        Designation.findOneAndUpdate({ _id: req.params.id}, { 
            $set: { 

                designationName: designationName && designationName,
                companyId: req.payload.id,
                companyName: company.companyName && company.companyName,
                description: description && description,
            }
       },
            async function (
                err,
                result
            ) {
                if (err) {
                    res.status(401).json({
                        status: 401,
                        success: false,
                        error: err

                    })

                    return;

                } else {
                    res.status(200).json({
                        status: 200,
                        success: true,
                        data: "Update Successful"
                      });
                      return;

                }})

      return
    } 
    let leaves = [];
    var leaveTypes = [];
    var exp = [];
    var expenseTypes = [];


    leaveAssignment.map((data, index) => {
      if (!data) {
        res.status(400).json({
          status: 400,
          error: "Leave id field is compulsory",
        });
        return;
      }
      leaves.push(data.leaveTypeId);
    });

    console.log({ leaves });

    const leavePromises = leaves.map(async (data, index) => {
      const check1 = await Leave.findOne({ _id: data });


      // if (!check1) {
      // console.log( check1 );

      // return  res.status(400).json({
      //     status: 400,
      //     success: false,
      //     error: "Leave type does not exist",
      //   });
      // }else{
      //   leaveTypes.push({
      //     leaveTypeId: data,
      //     leaveName: check1.leaveName,
      //     noOfLeaveDays: Number(leaveAssignment[index].noOfLeaveDays),
      //   });
      // }

     
    })
console.log({expenseCard})
    await expenseCard.map((data, index) => {
      if (!data) {
        res.status(400).json({
          status: 400,
          error: "Expense id field is compulsory",
        });
        return;
      }
      exp.push(data.expenseTypeId);
    });

    console.log({ exp });
    const expensePromises = exp.map(async (data, index) => {
      const check = await Expense.findOne({ _id: data });

      console.log({ check });

      if (!check) {
         
        res.status(400).json({
          status: 400,
          error: "Expense type does not exist",
        });
        return 
      }

      expenseTypes.push({
        expenseTypeId: data,
        expenseCardName: check.expenseCardName,
        cardCurrency: expenseCard[index].cardCurrency,
        cardBalance: expenseCard[index].cardLimit,
        cardExpiryDate: expenseCard[index].cardExpiryDate,
        cardLimit: expenseCard[index].cardLimit,
      });
    });

    Promise.all(expensePromises, leavePromises)
      .then(async () => {
        console.log({ leaveTypes });

        console.log(leaveAssignment);

        Designation.findOneAndUpdate({ _id: req.params.id}, { 
            $set: { 
    
                designationName: designationName && designationName,
                companyId: req.payload.id,
                companyName: company.companyName && company.companyName,
                description: description && description,
                leaveTypes: leaveTypes && leaveTypes,
                expenseCard: expenseTypes && expenseTypes
            }
       },
            async function (
                err,
                result
            ) {
                if (err) {
                    res.status(401).json({
                        status: 401,
                        success: false,
                        error: err
    
                    })
    
                    return;
    
                } else {
               
                  await Employee.update(
                    { companyId: req.payload.id, "leaveAssignment.leaveTypeId": { $in: leaves } },
                    {
                      $set: {
                        "leaveAssignment.$.leaveTypeId.leaveName": leaveTypes.leaveName && leaveTypes.leaveName,
                        "leaveAssignment.$.leaveTypeId.noOfDays": leaveTypes.noOfLeaveDays && leaveTypes.noOfLeaveDays ,
                        "leaveAssignment.$.leaveTypeId.paid": leaveTypes.paid && leaveTypes.paid ,
                      },
                    },
                  
              //  { 
              //   arrayFilters: [
              //       {
              //           "i.leaveTypeId":  { $in: leaves }
              //       }
              //   ]},
               
                  async function (
                      err,
                      result
                  ) {
                      if (err) {
                          res.status(401).json({
                              status: 401,
                              success: false,
                              error: err
                          })
                          return;
                      }else{
                        res.status(200).json({
                          status: 200,
                          success: true,
                          data: "Update Successful"
                        });
                        return;
                      };
              })
            }
          });
        }).catch((err) => {
          res.status(500).json({
            status: 500,
            success: false,
            error: err,
          });
      })
    }
        // let designations = await new Designation({
        //   designationName,
        //   companyId: req.payload.id,
        //   companyName: company.companyName,
        //   description,
        //   leaveTypes: leaveTypes && leaveTypes,
        // });

        // await designations
        //   .save()
        //   .then((adm) => {
        //     console.log(adm);
        //     res.status(200).json({
        //       status: 200,
        //       success: true,
        //       data: adm,
        //     });
        //     return;
        //   })
        //   .catch((err) => {
        //     console.error(err);
        //     res.status(400).json({
        //       status: 400,
        //       success: false,
        //       error: err,
        //     });

        //     return;
        //   });
      

  


 catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      error: error,
    });
  }
};
export default updateDesignation;
