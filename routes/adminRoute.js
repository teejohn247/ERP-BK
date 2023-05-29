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



const { userValidationRules, validate } = require('../middleware/signUpValidation')

const router = express.Router();



router.post('/addEmployee', auth, inviteEmployee);

router.post('/addLeaveType/:roleId', auth, addLeave);
router.patch('/addHmo/:id', addHmo);
router.post('/addCompany', addCompany);
router.post('/signIn', signin);
router.post('/addRole', auth, addRole);
router.post('/updateRole/:id', updateRole);
router.get('/fetchCompanyRoles', auth, fetchRole);
router.get('/fetchCompany', auth, fetchCompany);


router.post('/createCompany', auth, createCompany);

router.post('/signUp',  signUp);




router.post('/addDepartment', auth, addDepartment);
router.get('/fetchDepartments', auth, fetchDepartment);
router.patch('/updateDepartment/:id', updateDepartment);
router.delete('/deleteDepartment/:id', deleteDepartment);
router.post('/addTable', addTable);
router.patch('/addPayment/:id', addPayment);
router.post('/updatePayment', updatePayment);
router.get('/fetchEmployees',  fetchEmployees);
router.get('/fetchEmployee/:id', fetchSpecificEmployees);
router.patch('/updateEmployee/:id', updateEmployee);
router.delete('/deleteEmployee/:id', deleteEmployee);







export default router;