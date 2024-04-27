
import dotenv from 'dotenv';
import Employee from '../../model/Employees';
import EmployeeTable from '../../model/EmployeeTable';

import Roles from '../../model/Roles';


import utils from '../../config/utils';

import { emailTemp } from '../../emailTemplate';
import uploadFiles from '../../middleware/uploadGC';
import exportFile from '../../middleware/export';


const sgMail = require('@sendgrid/mail')

dotenv.config();


const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

sgMail.setApiKey(process.env.SENDGRID_KEY);

// Function to generate XLSX file from JSON
function generateXLSX(jsonData) {
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(jsonData);
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet 1');
    const xlsxFilePath = path.join(__dirname, 'output.xlsx');
    xlsx.writeFile(wb, xlsxFilePath);
    return xlsxFilePath;
  }

const exportEmployees = async (req, res) => {

    try {

        const { page, limit } = req.query;

        const employee = await Employee.find({companyId: req.payload.id}).sort({_id: -1})
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();



        
        const employeeTable = await EmployeeTable.find()

        const count = await Employee.find().countDocuments()

        if(!employee){
            res.status(404).json({
                status:404,
                success: false,
                error:'No employee Found'
            })
            return
        }else{
          // Generate XLSX file from employee data
          console.log({employee})
    const xlsxFilePath = generateXLSX(employee);
    console.log({xlsxFilePath})

    // Upload XLSX file to Google Cloud Storage
    const fileUrl = await exportFile(xlsxFilePath);
    console.log({fileUrl})

    // Delete the generated local file after uploading to GCS
    fs.unlinkSync(xlsxFilePath);



            res.status(200).json({
                status: 200,
                success: true,
                downloadLink: fileUrl, // Return the link to download the exported file
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
export default exportEmployees;



