
// import dotenv from 'dotenv';
// import Employee from '../../model/Employees';
// import EmployeeTable from '../../model/EmployeeTable';

// import Roles from '../../model/Roles';


// import utils from '../../config/utils';

// import { emailTemp } from '../../emailTemplate';
// import uploadFiles from '../../middleware/uploadGC';
// import exportFile from '../../middleware/export';


// const sgMail = require('@sendgrid/mail')

// dotenv.config();


// const xlsx = require('xlsx');
// const fs = require('fs');
// const path = require('path');

// sgMail.setApiKey(process.env.SENDGRID_KEY);

// // Function to generate XLSX file from JSON
// function generateXLSX(jsonData) {
//     const wb = xlsx.utils.book_new();
//     const ws = xlsx.utils.json_to_sheet(jsonData);
//     xlsx.utils.book_append_sheet(wb, ws, 'Sheet 1');
//     const xlsxFilePath = path.join(__dirname, 'output.xlsx');
//     xlsx.writeFile(wb, xlsxFilePath);
//     return xlsxFilePath;
//   }

//   function removeArrayFields(obj) {
//     if (typeof obj !== 'object' || obj === null) {
//         return obj;
//     }
    
//     const newObj = {};
//     for (const key in obj) {
//         if (!Array.isArray(obj[key]) && typeof obj[key] === 'object') {
//             newObj[key] = removeArrayFields(obj[key]);
//         } else if (!Array.isArray(obj[key])) {
//             newObj[key] = obj[key];
//         }
//     }
//     console.log({newObj})
//     return newObj;
// }

// const exportEmployees = async (req, res) => {

//     try {

//         const { page, limit } = req.query;

//         const employee = await Employee.find({companyId: req.payload.id}).sort({_id: -1})
//         .limit(limit * 1)
//         .skip((page - 1) * limit)
//         .exec();



        
//         const employeeTable = await EmployeeTable.find()

//         const count = await Employee.find().countDocuments()

//         if(!employee){
//             res.status(404).json({
//                 status:404,
//                 success: false,
//                 error:'No employee Found'
//             })
//             return
//         }else{
// // Define an array of fields to keep
// const fieldsToExclude = ['expenseDetails', 'approvals', 'leaveAssignment', 'assignedAppraisals', 'officialInformation', 'paymentInformation', 'appraisals'];

// // Create a new array of employee objects with only the specified fields
// console.log({employee})
// const modifiedSampleEmployees = await employee.map(employe => {
//     const modifiedEmployee = {};
//     for (const key in employe) {
//         if ((key in employe) && !fieldsToExclude.includes(key)) {
//             modifiedEmployee[key] = employe[key];
//         }
//     }
//     // fieldsToKeep.forEach(field => {
//     //     fieldsToKeep.forEach(field => {
//     //         if (field in employe) {
//     //             modifiedEmployee[field] = employe[field];
//     //         }
//     //     });
//     // });
//     return modifiedEmployee;
// });

// // Now modifiedSampleEmployees contains a new array of objects with only the specified fields from each object
// console.log({modifiedSampleEmployees});

// const sampleEmployees = [
//     {
//         expenseDetails: { /* Object */ },
//         _id: new ObjectId("65b4d42ba8df395abcee8ebd"),
//         companyName: 'Silo',
//         companyId: '658dd2c50b614dd1fcd2085a',
//         activeStatus: true,
//         firstName: 'Favour',
//         lastName: 'Princewill',
//         // Other fields...
//     },
//     // More employee objects...
// ];

// // // Define an array of fields to keep
// // const fieldsToKeep = ['_id', 'companyName', 'companyId', 'activeStatus', 'firstName', 'lastName'];

// // // Create a new array of employee objects with only the specified fields
// // const modifiedSampleEmployees = employee.map(employe => {
// //     console.log({employe})
// //     const modifiedEmployee = {};
// //     fieldsToKeep.forEach(field => {

// //         console.log(employe.hasOwnProperty(field), {field})
// //         if (employe.hasOwnProperty(field)) {
// //             modifiedEmployee[field] = employe[field];
// //         }
// //     });
// //     return modifiedEmployee;
// // });

// // Now modifiedSampleEmployees contains a new array of objects with only the specified fields from each object
// console.log({modifiedSampleEmployees});

 
//     const xlsxFilePath = generateXLSX(employee);
//     console.log({xlsxFilePath})

//     // Upload XLSX file to Google Cloud Storage
//     const fileUrl = await exportFile(xlsxFilePath);
//     console.log({fileUrl})

//     // Delete the generated local file after uploading to GCS
//     fs.unlinkSync(xlsxFilePath);



//             res.status(200).json({
//                 status: 200,
//                 success: true,
//                 downloadLink: fileUrl, // Return the link to download the exported file
//             })
//         }

//     } catch (error) {
//         res.status(500).json({
//             status: 500,
//             success: false,
//             error: error
//         })
//     }
// }
// export default exportEmployees;





import dotenv from 'dotenv';
import Employee from '../../model/Employees';
import EmployeeTable from '../../model/EmployeeTable';
import Roles from '../../model/Roles';
import utils from '../../config/utils';
import { emailTemp } from '../../emailTemplate';
import uploadFiles from '../../middleware/uploadGC';
import exportFile from '../../middleware/export';
import sgMail from '@sendgrid/mail';
import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_KEY);

// Function to generate XLSX file from JSON
function generateXLSX(jsonData) {
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(jsonData);
  xlsx.utils.book_append_sheet(wb, ws, 'Sheet 1');
  const xlsxFilePath = path.join(__dirname, `employees_${new Date().getTime()}.xlsx`);
  xlsx.writeFile(wb, xlsxFilePath);
  return xlsxFilePath;
}

function removeArrayFields(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  
  const newObj = {};
  for (const key in obj) {
    if (!Array.isArray(obj[key]) && typeof obj[key] === 'object') {
      newObj[key] = removeArrayFields(obj[key]);
    } else if (!Array.isArray(obj[key])) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}

const exportEmployees = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const companyId = req.payload.id;

    const employees = await Employee.find({ companyId })
      .sort({ _id: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .exec();

    const count = await Employee.countDocuments({ companyId });

    if (!employees || employees.length === 0) {
      return res.status(404).json({
        status: 404,
        success: false,
        error: 'No employee found'
      });
    }

    const fieldsToExclude = ['expenseDetails', 'approvals', 'leaveAssignment', 'assignedAppraisals', '__v', 'password', 'officialInformation', 'paymentInformation', 'roles', 'appraisals'];

    const modifiedEmployees = employees.map(employee => {
      const modifiedEmployee = {};
      for (const key in employee._doc) {
        if (!fieldsToExclude.includes(key)) {
          modifiedEmployee[key] = employee[key];
        }
      }
      return modifiedEmployee;
    });

    console.log({modifiedEmployees})

    const xlsxFilePath = generateXLSX(modifiedEmployees);
    const fileUrl = await exportFile(xlsxFilePath);
    
    // Delete the generated local file after uploading to GCS
    fs.unlinkSync(xlsxFilePath);

    return res.status(200).json({
      status: 200,
      success: true,
      downloadLink: fileUrl,
    });

  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      error: error.message,
    });
  }
};

export default exportEmployees;
