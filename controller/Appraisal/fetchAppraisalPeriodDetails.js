
import dotenv from 'dotenv';
import Role from '../../model/Debit';
import PayrollPeriod from '../../model/AppraisalPeriod';
import PeriodPayData from '../../model/EmployeeKpis'
import Employee from '../../model/Employees';
import Company from '../../model/Company';



const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const fetchAppraisalPeriodDetails = async (req, res) => {

    try {

        const { page, limit } = req.query;


        const role = await PayrollPeriod.find({_id: req.params.id})
        .sort({endDate: 1})
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();


        console.log(role)

        const comp =  await Company.findOne({_id: req.payload.id})
        const employee =  await Employee.findOne({_id: req.payload.id})



     if(comp){


        // let period = await PeriodPayData.findOne({ payrollPeriodId: adm._id});
        // console.log({period})

        const all = [];

        
        const promises = role.map(async (empp) => {
            console.log({ empp });
            
            const period = await PeriodPayData.find({company: employee.companyId, appraisalPeriodId: empp._id });
            console.log({ period });

            all.push({
                ...empp.toObject(), // Convert Mongoose document to JS object
                appraisalData: period.map(emp => ({

                  _id: emp._id,
                //   companyId: emp.companyId,
                //   companyName: emp.companyName,
                //   appraisalPeriodId: empp._id,
                  fullName: emp.employeeName,
                  profilePics: emp.profilePics,
                  matrixScore: emp.matrixScore,
                  managerName: emp.managerName,
                  managerId: emp.managerId,
                  employeeSignedDate: emp.employeeSignedDate, // Assigning role field from Employee model
                  employeeSignStatus: emp.employeeSignStatus,
                  managerSignStatus: emp.managerSignStatus,
                  managerSignedDate: emp.managerSignedDate,
                  kpiGroups: employee.appraisals,
                  
                })),
              });
          
              // console.log({ all });
            });
        
          await Promise.all(promises).then(()=> {
            res.status(200).json({
                status: 200,
                success: true,
                data: all,
            });
          })

        }else if(employee){

        // let period = await PeriodPayData.findOne({ payrollPeriodId: adm._id});
        // console.log({period})

        const all = [];

        console.log({employee})

        
        const promises = role.map(async (empp) => {
            console.log({ empp });
            
            const period = await PeriodPayData.find({ appraisalPeriodId: empp._id, employeeId: req.payload.id});

            console.log({ period });
        
            all.push({
                ...empp.toObject(), // Convert Mongoose document to JS object
                appraisalData: period.map(emp => ({
                    _id: emp._id,
                    fullName: emp.employeeName,
                    profilePics: emp.profilePics,
                    matrixScore: emp.matrixScore,
                    managerName: emp.managerName,
                    managerId: emp.managerId,
                    employeeSignedDate: emp.employeeSignedDate, // Assigning role field from Employee model
                    employeeSignStatus: emp.employeeSignStatus,
                    managerSignStatus: emp.managerSignStatus,
                    managerSignedDate: emp.managerSignedDate,
                    kpiGroups: emp.kpiGroups,
                    
                  })),
              });
          
              // console.log({ all });
            });
        
          await Promise.all(promises).then(()=> {
            res.status(200).json({
                status: 200,
                success: true,
                data: all,
            });
          })
        }

    } catch (error) {

        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })
    }
}
export default fetchAppraisalPeriodDetails;