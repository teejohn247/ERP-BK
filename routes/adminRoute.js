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

const { userValidationRules, validate } = require('../middleware/signUpValidation')

const cloudinary = require("cloudinary").v2;
const Multer = require("multer");

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

router.post("/addImage/:id", upload.single("my_file"), imageUploader, addImage);
router.post('/addEmployee', auth, inviteEmployee);

router.patch('/addLeaveType/:roleId', auth, addLeave);
router.patch('/addHmo/:id', addHmo);
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



export default router;