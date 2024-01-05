
import dotenv from 'dotenv';
import Role from '../../model/Role';
import Company from '../../model/Company';
import Payroll from '../../model/Payroll';
import PeriodPayData from '../../model/PeriodPayData';

const csv = require('csvtojson');



const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);


const createPeriodPayData = async (req, res) => {

    try {

        console.log(req.file)
       

        let company = await Company.findOne({ _id: req.payload.id });

        const deletePromises = [

            await PeriodPayData.deleteMany({ payrollPeriodId: req.params.id }),
            
          ]
      
          await Promise.all(deletePromises)

        csv()
        .fromFile(req.file.path)
        .then(async (jsonObj) => {
        console.log({jsonObj})

        jsonObj.map((data, index) => {
            data.companyName = company.companyName;
            data.companyId = req.payload.id;
        })
        for (const data of jsonObj) {
            console.log({data})
            const newPeriodPayData = new PeriodPayData({
                // companyId: data.companyId,
                // companyName: data.companyName,
                payrollPeriodId: req.params.id,
                userId: data.userId && data.userId,
                email: data.email && data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                fullName:data.fullName,
                profilePic: data.profilePic,
                department: data.department,
                designation: data.designation,
                role: data.role, // Assigning role field from Employee model
                bonus: data.bonus, // Example default values
                standard: data.standard,
                basicPay: data.basicPay,
                pension: data.pension,
                insurance: data.insurance,
                payeTax: data.payeTax,
                netPay: data.netPay,
                totalEarnings: data.totalEarnings,
                status: data.status, // Default status
              });

                console.log({newPeriodPayData})
        
                await newPeriodPayData.save().then((adm) => {
                    console.log({adm});
                  
                }).catch((err) => {
                        console.error(err)
                        res.status(400).json({
                            status: 400,
                            success: false,
                            error: err
                        })
                    })
            }
            res.status(200).json({
                status: 200,
                success: true,
                data: jsonObj
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
export default createPeriodPayData;