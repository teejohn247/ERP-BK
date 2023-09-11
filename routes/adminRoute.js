import express from 'express';
import addCompany from '../controller/Company/addCompany';
import signin from '../controller/Company/signIn';
import addDepartment from '../controller/Department/addDepartment';
import deleteDepartment from '../controller/Department/deleteDepartment';
import fetchDepartment from '../controller/Department/fetchDepartment';
import updateDepartment from '../controller/Department/updateDepartment';
import addPayment from '../controller/Employers/addPaymentInformation';
import addTable from '../controller/Employers/addTable';
import inviteEmployee from '../controller/Employers/createEmployers';
import deleteEmployee from '../controller/Employers/deleteEmployer';
import fetchEmployees from '../controller/Employers/fetchEmployees';
import fetchSpecificEmployees from '../controller/Employers/fetchSpecificEmployee';
import updateEmployee from '../controller/Employers/updateEmployer';
import updatePayment from '../controller/Employers/updatePayment';
import addHmo from '../controller/Role/addHmo';
import addLeave from '../controller/Role/addLeaveType';
import addRole from '../controller/Role/addRole';
import fetchRole from '../controller/Role/fetchRole';
import updateRole from '../controller/Role/updateRole';
import middlewareDetect from '../middleware/middlewareDetect';
import auth from '../middleware/auth'
import fetchCompany from '../controller/Company/fetchCompany';
import createCompany from '../controller/Company/createCompany';
import signUp from '../controller/Company/signUp';
import createDesignation from '../controller/createDesignation/createDesignation';
import fetchDesignation from '../controller/createDesignation/fetchDesignation';
// import upload from '../config/multer.config';
import imageUploader from '../middleware/uploadFile'
// import upload from '../middleware/uploadFile';
import addImage from '../controller/addImage';
import { cloudinaryConfig }  from '../config/cloudinary';
import listAudits from '../controller/AuditTrail.js/listAudits';
import addDesignationLeave from '../controller/createDesignation/addDesignationLeave';
import addDesignationHmo from '../controller/createDesignation/addDesignationHmo';
import sheetModel from '../model/Test'
import Employees from '../model/Employees';
import forgotPassword from '../controller/Company/forgotPassword';
import changePassword from '../controller/Company/changePassword';
import verifyToken from '../controller/Company/verifyToken';
import bulkEmployee from '../controller/Employers/bulkEmployees';
import verifyNewUser from '../controller/Company/verifyNewUser';

const { userValidationRules, validate } = require('../middleware/signUpValidation')
const multer = require("multer");
const mult = multer({ dest: "uploads/" });
const cloudinary = require("cloudinary").v2;
const Multer = require("multer");
const csv = require('csvtojson');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET,
  });

  
  const storage = new Multer.memoryStorage();
  const upload = Multer({
    storage,
  });

  async function handleUpload(file) {
    const res = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });
    return res;
  }

const router = express.Router();

router.post("/upload-cv", mult.single("csv"), (req, res) => {
  console.log(req.file)
  //convert csvfile to jsonArray
  
  const fileName = req.file.filename

  console.log(fileName)

    csv()
    .fromFile(req.file.path)
    .then((jsonObj) => {
      console.log(jsonObj)
   
      Employees.insertMany(jsonObj, function(err){
        if (err){
          console.log(err);

          res.status(500).json({
            status: 500,
            success: true,
            data: err
        })

        } else {
          console.log("Succesfully saved");
          res.status(200).json({
            status: 200,
            success: true,
            data: "Update Successful"
        })
        }
      });

});
});

router.get('/forgotPassword', forgotPassword);
router.patch('/changePassword', auth, changePassword);
router.patch('/verifyPassword', verifyToken);




router.post("/addImage/:id", auth, upload.single("my_file"), imageUploader, addImage);
router.post('/addEmployee', auth, inviteEmployee);
router.patch('/addLeaveType/:roleId', auth, addLeave);
// router.patch('/addHmo/:id', auth, addHmo);
router.patch('/addLeave/:id', auth, addDesignationLeave);
router.patch('/addHmo/:id', auth, addDesignationHmo);
router.post('/addCompany', addCompany);
router.post('/signIn', signin);
router.post('/addRole', auth, addRole);
router.post('/updateRole/:id', updateRole);
router.get('/fetchCompanyRoles', auth, fetchRole);
router.get('/fetchCompany', auth, fetchCompany);
router.post('/createCompany', auth, createCompany);
router.post('/signUp', signUp);
router.post('/createDesignation', auth,  createDesignation);
router.post('/addDepartment', auth, addDepartment);
router.get('/fetchDepartments', auth, fetchDepartment);
router.patch('/updateDepartment/:id',auth, updateDepartment);
router.delete('/deleteDepartment/:id',auth, deleteDepartment);
router.post('/addTable', addTable);
router.patch('/addPayment/:id',auth, addPayment);
router.post('/updatePayment', auth, updatePayment);
router.get('/fetchEmployees',auth,  fetchEmployees);
router.get('/fetchEmployee/:id', auth, fetchSpecificEmployees);
router.patch('/updateEmployee/:id', auth, updateEmployee);
router.delete('/deleteEmployee/:id', auth, deleteEmployee);
router.get('/fetchDesignations', auth, fetchDesignation);
router.get('/listAuditTrails', auth, listAudits);

router.post("/uploadEmployees", auth, mult.single("csv"), bulkEmployee);
router.post("/verifyEmail", verifyNewUser);



export default router;