
import dotenv from 'dotenv';
import Role from '../../model/Role';
import Company from '../../model/Company';
import Leave from '../../model/Expense';
import PayrollPeriod from '../../model/PayrollPeriod';
import Employee from '../../model/Employees';
import PeriodPayData from '../../model/PeriodPayData';
import Credits from '../../model/Credits';
import Debits from '../../model/Debit';





const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);


const createPayrollPeriod = async (req, res) => {

    try {
       
        const { payrollPeriodName, description, startDate, endDate } = req.body;

      
        let company = await Company.findOne({ _id: req.payload.id });
        let credits = await Credits.find({ companyId: company._id });
        let debits = await Debits.find({ companyId: company._id });


        let appraisal = await PayrollPeriod.findOne({ companyId:company._id,  payrollPeriodName: payrollPeriodName });
        let employees = await Employee.find({ companyId: req.payload.id }, {_id: 1, companyRole:1, companyId: 1, companyName: 1, firstName:1, lastName: 1, role:1, designationName:1, department: 1, fullName: 1, profilePic: 1})

        console.log({credits})
        console.log({debits})
   

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
        let total = await PayrollPeriod.find();

        const d = new Date();
        let year = d.getFullYear();
        let month = d.getMonth();
        let day = d.getDay();

        let group = new PayrollPeriod({
            companyId: req.payload.id,
            companyName: company.companyName,
            payrollPeriodName,
            reference: `PAY-${month}${day}-${total.length + 1}`,
            description, 
            startDate, 
            endDate, 
        })

        console.log({group})

        let dynamicFields = {};

        credits.length > 0 && credits.map((credit) => {
            if (credit.name && typeof credit.name === 'string') {
              dynamicFields[credit.name] = 0;
            }
          });

          debits.length > 0 &&  debits.map((debit) => {
            if (debit.name && typeof debit.name === 'string') {
              dynamicFields[debit.name] = 0;
            }
          });
        console.log({ dynamicFields });


  

        await group.save().then(async (adm) => {
            console.log(adm)

            const promises =  await employees.map(async (empp, i) => {

            console.log({empp});

            const newPeriodPayData = new PeriodPayData({
              companyId: empp.companyId,
              companyName: empp.companyName,
              payrollPeriodId: adm._id,
              firstName: empp.firstName,
              lastName: empp.lastName,
              fullName: empp.fullName,
              employeeId: empp.employeeId,
              department: empp.department,
              designation: empp.designationName,
              profilePic: empp.profilePic,
              role: empp.companyRole,  
                 // Adding keys from `debits.name` with value 0
                 dynamicFields: dynamicFields,
            //   bonus: 0, // Example default values
            //   standard: 0,
            //   basicPay: 0,
            //   pension: 0,
            //   insurance: 0,
            //   payeTax: 0,
              netEarnings: 0,
              totalEarnings: 0,
              status: 'Pending', // Default status
            });
            console.log({newPeriodPayData});

            const savedData = await newPeriodPayData.save();
            return savedData;
        
          });


          const newPeriodPayDatas = await Promise.all(promises);

         
        const payrollPeriodData = newPeriodPayDatas.map(emp => ({
            companyId: emp.companyId,
            companyName: emp.companyName,
            payrollPeriodId: adm._id,
            firstName: emp.firstName,
            lastName: emp.lastName, 
            fullName: emp.fullName,
            profilePic: emp.profilePic,
            role: emp.companyRole, // Assigning role field from Employee model
            bonus: 0, // Example default values
            standard: 0,
            basicPay: 0,
            pension: 0,
            insurance: 0,
            payeTax: 0,
            totalEarnings: 0,
            status: 'Pending', // Default status
          }));



          let period = await PayrollPeriod.findOne({ _id: adm._id});
          console.log({period})
          console.log('4',[...newPeriodPayDatas])

          const combinedPeriodPayData = {
            ...period.toObject(), // Convert Mongoose document to JS object
            payrollPeriodData: [...newPeriodPayDatas]
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
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })
    }
}
export default createPayrollPeriod;



