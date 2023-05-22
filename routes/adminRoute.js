import express from 'express';
import addTable from '../controller/Employers/addTable';
import inviteEmployee from '../controller/Employers/createEmployers';
import deleteEmployee from '../controller/Employers/deleteEmployer';
import fetchEmployees from '../controller/Employers/fetchEmployees';
import fetchSpecificEmployees from '../controller/Employers/fetchSpecificEmployee';
import updateEmployee from '../controller/Employers/updateEmployer';
import middlewareDetect from '../middleware/middlewareDetect';





const { userValidationRules, validate } = require('../middleware/signUpValidation')

const router = express.Router();



router.post('/addEmployer', inviteEmployee);

router.post('/addTable', addTable);

router.get('/fetchEmployees',  fetchEmployees);
router.get('/fetchEmployee/:id', fetchSpecificEmployees);
router.patch('/updateEmployee/:id', updateEmployee);
router.delete('/deleteEmployee/:id', deleteEmployee);







export default router;