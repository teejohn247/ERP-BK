import dotenv from "dotenv";
import Role from "../../model/Role";
import Company from "../../model/Company";
import Designation from "../../model/Designation";
import Leave from "../../model/Leaves";

const sgMail = require("@sendgrid/mail");

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_KEY);

const updateDesignation = async (req, res) => {
  try {
    const { designationName, description, leaveAssignment } = req.body;

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

        return;
    } 
    let leaves = [];
    var leaveTypes = [];

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
      const check = await Leave.findOne({ _id: data });

      console.log({ check });

      if (!check) {
        res.status(400).json({
          status: 400,
          error: "Leave type does not exist",
        });
        return Promise.reject("Leave type does not exist");
      }

      leaveTypes.push({
        leaveTypeId: data,
        leaveName: check.leaveName,
        noOfLeaveDays: leaveAssignment[index].noOfLeaveDays,
      });
    });

    Promise.all(leavePromises)
      .then(async () => {
        console.log({ leaveTypes });

        console.log(leaveAssignment);

        Designation.findOneAndUpdate({ _id: req.params.id}, { 
            $set: { 
    
                designationName: designationName && designationName,
                companyId: req.payload.id,
                companyName: company.companyName && company.companyName,
                description: description && description,
                leaveTypes: leaveTypes && leaveTypes
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

             return;


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
      })


  


      .catch((error) => {
        // Handle errors from the promises
        console.error("Error:", error);
      });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      error: error,
    });
  }
};
export default updateDesignation;
