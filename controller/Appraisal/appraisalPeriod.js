
import dotenv from 'dotenv';
import Role from '../../model/Role';
import Company from '../../model/Company';
import Leave from '../../model/Expense';
import AppraisalGroup from '../../model/AppraisalPeriod';
import AppraisalData from '../../model/AppraisalData';


import Employee from '../../model/Employees';


const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);


const createPeriod = async (req, res) => {

    try {
       
        const { name, description, startDate, endDate, activeDate, inactiveDate } = req.body;


        let company = await Company.findOne({ _id: req.payload.id });

        let appraisal = await AppraisalGroup.findOne({ companyId:company._id,  appraisalPeriodName: name });
        let employees = await Employee.find({ companyId: req.payload.id }, {_id: 1, companyRole:1, companyId: 1, companyName: 1, firstName:1, lastName: 1, role:1, designationName:1, department: 1, fullName: 1, profilePic: 1})


        console.log({appraisal})

        if (!company.companyName) {
            res.status(400).json({
                status: 400,
                error: 'No company has been created for this account'
            })
            return;
        }


        if (appraisal) {
            res.status(400).json({
                status: 400,
                error: 'This period name already exist'
            })
            return;
        }

       let group = new AppraisalGroup({
            companyId: req.payload.id,
            companyName: company.companyName,
            appraisalPeriodName: name, 
            description, 
            startDate, 
            endDate, 
            activeDate, 
            inactiveDate 
        })




        await group.save().then(async (adm) => {
            console.log(adm)

            const promises =  await employees.map(async (empp, i) => {

            console.log({empp});

            const newAppraisalData = new AppraisalData({
              companyId: empp.companyId,
              companyName: empp.companyName,
              payrollPeriodId: adm._id,
              firstName: empp.firstName,
              lastName: empp.lastName,
              fullName: empp.fullName,
              employeeId: empp._id,
              department: empp.department,
              designation: empp.designationName,
              profilePic: empp.profilePic,
              role: empp.companyRole,  
              kpiGroups: []
                 // Adding keys from `debits.name` with value 0
            //  dynamicFields: dynamicFields,
           
            });
            console.log({newAppraisalData});

            const savedData = await newAppraisalData.save();
            return savedData;
        
          });


          const newAppraisalDatas = await Promise.all(promises);

         
        const payrollPeriodData = newAppraisalDatas.map(emp => ({
            companyId: emp.companyId,
            companyName: emp.companyName,
            payrollPeriodId: adm._id,
            firstName: emp.firstName,
            lastName: emp.lastName, 
            fullName: emp.fullName,
            profilePic: emp.profilePic,
            role: emp.companyRole, // Assigning role field from Employee model
           
          }));



          let period = await AppraisalGroup.findOne({ _id: adm._id});
          console.log({period})
          console.log('4',[...newAppraisalDatas])

          const combinedPeriodPayData = {
            ...period.toObject(), // Convert Mongoose document to JS object
            appraisalData: [...newAppraisalDatas]
          };
        
          console.log({combinedPeriodPayData})

            res.status(200).json({
                status: 200,
                success: true,
                data:  combinedPeriodPayData
            })
        }).catch((err) => {
                console.error(err)
                res.status(400).json({
                    status: 400,
                    success: false,
                    error: err
                })
            })




















        // await group.save().then((adm) => {
        //     console.log(adm)
        //     res.status(200).json({
        //         status: 200,
        //         success: true,
        //         data: adm
        //     })
        // }).catch((err) => {
        //         console.error(err)
        //         res.status(400).json({
        //             status: 400,
        //             success: false,
        //             error: err
        //         })
        //     })
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })
    }
}
export default createPeriod;



