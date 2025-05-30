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
import imageUploader from '../middleware/uploadFile';
import uploadFiles from '../middleware/uploadGC';

// import upload from '../middleware/uploadFile';
import addImage from '../controller/addImage';
import { cloudinaryConfig } from '../config/cloudinary';
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
import verifyEmployee from '../controller/Employers/verifyEmployee';
import createLeave from '../controller/Leave/createLeave';
import updateLeave from '../controller/Leave/updateLeave';
import fetchLeaves from '../controller/Leave/fetchLeave';
import fetchLeavesDetails from '../controller/Leave/fetchLeaveDetails';
import updateEmployeeAdmin from '../controller/Employers/updateEmployeeAdmin';
import updateEmployee from '../controller/Employers/updateEmployee';
import updateDesignation from '../controller/createDesignation/updateDesignation';
import deleteDesignation from '../controller/createDesignation/deleteDesignation';
import deleteLeave from '../controller/Leave/deleteLeave';
import assignManager from '../controller/Department/assignManager';
import assignManagerEmployee from '../controller/Employers/assignManagerEmployee';
import leaveApplication from '../controller/Employers/leaveApplication';
import leaveAction from '../controller/Employers/leaveAction';
import getLeaveRecords from '../controller/Employers/getLeaveRecords';
import assignDesignation from '../controller/createDesignation/assignDesignation';
import signDecode from '../middleware/signDecode';
import getAdminRecords from '../controller/Employers/getAdminRecords';
import createExpense from '../controller/Expense/createExpense';
import fetchExpenseDetails from '../controller/Expense/fetchExpenseDetails';
import fetchExpense from '../controller/Expense/fetchExpense';
import deleteExpense from '../controller/Expense/deleteExpense';
import updateExpense from '../controller/Expense/updateExpense';
import searchEmployee from '../controller/Employers/searchEmployee';
import updateLeaveApplication from '../controller/Employers/updateLeaveApplication';
import deleteLeaveApplication from '../controller/Employers/deleteLeaveApplication';
import createExpenseRequest from '../controller/Employers/createExpenseRequest';
import fetchExpenseReqs from '../controller/Employers/fetchLeaveRequests';
import getLeaveRecordsDetails from '../controller/Employers/fetchLeaveRequestsDetails';
import fetchExpenseReqDetails from '../controller/Employers/fetchLeaveReqDetails';
import fetchExpenseReqsAdmin from '../controller/Employers/fetchLeaveRequestsAdmin';
import createGroup from '../controller/Appraisal/CreateGroup';
import createKPI from '../controller/Appraisal/createKPI';
import createRating from '../controller/Appraisal/createRating';
import createPeriod from '../controller/Appraisal/appraisalPeriod';
import createFinal from '../controller/Appraisal/createFinal';
import assignKpis from '../controller/Appraisal/assignKpisToGroups';
import fetchGroups from '../controller/Appraisal/fetchGroups';
import fetchKPIs from '../controller/Appraisal/fetchKPIs';
import fetchRatings from '../controller/Appraisal/fetchRatings';
import fetchFinal from '../controller/Appraisal/fetchFinal';
import updateKPI from '../controller/Appraisal/updateKpi';
import updatePeriod from '../controller/Appraisal/updatePeriod';
import updateRating from '../controller/Appraisal/updateRating';
import updateGroup from '../controller/Appraisal/updateGroup';
import updateFinal from '../controller/Appraisal/updateFinal';
import fetchPeriod from '../controller/Appraisal/fetchPeriod';
import deleteFinal from '../controller/Appraisal/deleteFinal';
import deleteGroup from '../controller/Appraisal/deleteGroup';
import deletePeriod from '../controller/Appraisal/deletePeriod';
import deleteRating from '../controller/Appraisal/deleteRating';
import deleteKPI from '../controller/Appraisal/deleteKPI';
import createRole from '../controller/systemRoles.js/createRole';
import createPermissions from '../controller/systemRoles.js/createPermissions';
import fetchPermissions from '../controller/systemRoles.js/fetchPermissions';
import fetchRoles from '../controller/systemRoles.js/fetchRoles';
import assignRole from '../controller/systemRoles.js/assignRoles';
import assignGroupsDepartment from '../controller/Appraisal/assignGroupsDepartment';
import assignGroupsDesignation from '../controller/Appraisal/assignGroupsDesignation';
import assignGroupsEmployees from '../controller/Appraisal/assignGroupsEmployees';
import approveExpense from '../controller/Expense/approveExpenseRequests';
import fetchGroupsByEmployee from '../controller/Appraisal/fetchGroupsByEmployee';
import fetchGroupsByDesignations from '../controller/Appraisal/fetchGroupsByDesignation';
import fetchGroupsByDepartment from '../controller/Appraisal/fetchGroupsByDeparment';
import fillAppraisal from '../controller/Appraisal/fillAppraisal';
import fetchFinalManager from '../controller/Appraisal/fetchFinalManager';
import createCredits from '../controller/Payroll/createCredits';
import createDebits from '../controller/Payroll/createDebit';
import payrollPeriod from '../controller/Payroll/payrollPeriod';
import fetchCredits from '../controller/Payroll/fetchCredits';
import fetchDebits from '../controller/Payroll/fetchDebits';
import fetchPayrollPeriod from '../controller/Payroll/fetchPayrollPeriod';
import updateCredits from '../controller/Payroll/updateCredit';
import updateDebits from '../controller/Payroll/updateDebits';
import updatePayrollPeriod from '../controller/Payroll/updatePayrollPeriod';
import createPayroll from '../controller/Payroll/createPayroll';
import fetchPayroll from '../controller/Payroll/fetchPayroll';
import fetchEmployeesByDepartment from '../controller/Employers/fetchEmployeesByDepartment';
import fetchRequests from '../controller/Requests/fetchRequests';
import approvedRequests from '../controller/Requests/approvedRequests';
import getAdminApprovedRecords from '../controller/Employers/getAdminApprovedRecords';
import deleteDebit from '../controller/Payroll/deleteDebit';
import deleteCredit from '../controller/Payroll/deleteCredit';
import deleteCompany from '../controller/Company/deleteCompany';
import deleteExpenseRequest from '../controller/Expense/deleteExpenseRequest';
import updateExpenseRequest from '../controller/Expense/updateExpenseRequest';
import createPayrollPeriod from '../controller/Payroll/payrollPeriodData';
import createPeriodPayData from '../controller/Payroll/createPeriodPayData';
import updatePayrollStatus from '../controller/Payroll/updatePayrollStatus';
import payrollGraph from '../controller/Payroll/payrollGraph';
import totalEarnings from '../controller/Payroll/grossSalary';
import netSalary from '../controller/Payroll/netSalary';
import fetchPayrollPrd from '../controller/Payroll/fetchPayrollPrd';
import fetchPayrollPeriodDetails from '../controller/Payroll/fetchPayrollPeriodDetails';
import leaveDetails from '../controller/Leave/leaveDetails';
import updatePeriodData from '../controller/Payroll/updatePeriodData';
import expenseGraph from '../controller/Expense/expenseGraph';
import addPaymentAdmin from '../controller/Employers/addPaymentAdmin';
import createHoliday from '../controller/Holiday/createHoliday';
import updateHoliday from '../controller/Holiday/updateHolidays';
import fetchHoliday from '../controller/Holiday/fetchHoliday';
import fetchHolidayDetails from '../controller/Holiday/fetchHolidayDetails';
import deleteHoliday from '../controller/Holiday/deleteHoliday';
import assignApproval from '../controller/Employers/assignApproval';
import setExpense from '../controller/Employers/setExpense';
import employeeKPI from '../controller/Appraisal/employeeKpi';
import rateKPI from '../controller/Appraisal/RateKPI';
import fetchAppraisalPeriodDetails from '../controller/Appraisal/fetchAppraisalPeriodDetails';
import fetchGroupsByPeriod from '../controller/Appraisal/fetchGroupsByPeriod';
import createMeeting from '../controller/Meeting/createMeeting';
import updateMeeting from '../controller/Meeting/updateMeeting';
import fetchMeeting from '../controller/Meeting/fetchMeeting';
import fetchMeetingDetails from '../controller/Meeting/fetchMeetingDetails';
import deleteMeeting from '../controller/Meeting/deleteMeeting';
import createVisit from '../controller/Visitors/createVisit';
import updateVisitor from '../controller/Visitors/updateVisitor';
import checkIn from '../controller/Visitors/checkIn';
import checkOut from '../controller/Visitors/checkOut';
import fetchVisits from '../controller/Visitors/fetchVisits';
import calender from '../controller/Holiday/calender';
import createJobListing from '../controller/JobListings/createJobListing';
import fetchJobListings from '../controller/JobListings/fetchJobListings';
import updateJobListing from '../controller/JobListings/updateJobListing';
import deleteJobListing from '../controller/JobListings/deleteJobListing';
import fetchJobListingDetails from '../controller/JobListings/fetchJobListingDetails';
import publishJobListing from '../controller/JobListings/publishJobListing';
import createForm from '../controller/JobListings/createForm';
import updateForm from '../controller/JobListings/updateForm';
import apply from '../controller/JobListings/apply';
import selectApplication from '../controller/JobListings/selectApplication';
import fetchSelectedApplications from '../controller/JobListings/fetchSelectedApplications';
import listApplications from '../controller/JobListings/listApplications';
import fetchNotifications from '../controller/Notification/fetchNotifications';
import readNotification from '../controller/Notification/readNotification';
import meetIntegration from '../helpers/meetIntegration';
import zoomIntegration from '../helpers/zoomIntegration';
import changeStage from '../controller/JobListings/changeStage';
import exportEmployees from '../controller/Employers/exportEmployees';
import checkInOut from '../controller/Visitors/checkInOut';
import fetchAttendance from '../controller/Visitors/fetchAttendance';
import listMasterApplications from '../controller/JobListings/listAllApplications';
import dailyAttendance from '../controller/Visitors/dailyAttendance';
import fetchTodaysAttendance from '../controller/Visitors/fetchTodaysAttendance';
import createOfferLetter from '../controller/JobListings/createOfferLetter';
import createContact from '../controller/CRM/Contacts/createContact';
import fetchContact from '../controller/CRM/Contacts/fetchContact';
import fetchSingleContact from '../controller/CRM/Contacts/fetchPurchaseOrder';
import addActivity from '../controller/CRM/Contacts/addActivity';
import deleteActivity from '../controller/CRM/Contacts/deleteActivity';
import addNotes from '../controller/CRM/Contacts/addNotes';
import deleteNote from '../controller/CRM/Contacts/deleteNote';
import createAgent from '../controller/Employers/createAgent';
import updateAgent from '../controller/Employers/updateAgent';
import deleteAgent from '../controller/Employers/deleteAgent';
import fetchAgents from '../controller/Employers/fetchAgents';
import deleteContact from '../controller/CRM/Contacts/deleteContact';
import updateContact from '../controller/CRM/Contacts/updateContact';
import createLead from '../controller/CRM/Leads/createLead';
import addLeadActivity from '../controller/CRM/Leads/addLeadActivity';
import deleteLeadActivity from '../controller/CRM/Leads/deleteLeadActivity';
import addLeadNotes from '../controller/CRM/Leads/addLeadNotes';
import deleteLeadNote from '../controller/CRM/Leads/deleteLeadNote';
import fetchLeads from '../controller/CRM/Leads/fetchLeads';
import fetchSingleLead from '../controller/CRM/Leads/fetchSingleLead';
import updateLead from '../controller/CRM/Leads/updateLead';
import deleteLead from '../controller/CRM/Leads/deleteLead';
import createTicket from '../controller/CRM/Support Ticket/createTicket';
import addTicketActivity from '../controller/CRM/Support Ticket/addTicketActivity';
import deleteTicketActivity from '../controller/CRM/Support Ticket/deleteTicketActivity';
import addTicketNotes from '../controller/CRM/Support Ticket/addTicketNotes';
import deleteTicketNote from '../controller/CRM/Support Ticket/deleteNote';
import fetchTicket from '../controller/CRM/Support Ticket/fetchTicket';
import fetchSingleTicket from '../controller/CRM/Support Ticket/fetchSingleTicket';
import deleteTicket from '../controller/CRM/Support Ticket/deleteTicket';
import updateTicket from '../controller/CRM/Support Ticket/updateTicket';
import addAgentActivity from '../controller/Employers/addAgentActivity';
import createQuotation from '../controller/CRM/Contacts/createQuotation';
import contactPicture from '../controller/CRM/Contacts/contactPicture';
import leadPicture from '../controller/CRM/Leads/leadPicture';
import agentPicture from '../controller/Employers/agentPicture';
import createPurchaseOrder from '../controller/CRM/Contacts/createPurchaseOrder';
import createInvoice from '../controller/CRM/Contacts/createInvoice';
import fetchInvoiceContact from '../controller/CRM/Contacts/fetchInvoiceContact';
import fetchPurchaseOrder from '../controller/CRM/Contacts/fetchPurchaseOrder';
import fetchQuotation from '../controller/CRM/Contacts/fetchQuotation';
import payrollYears from '../controller/Payroll/payrollYears';
import fetchEmails from '../controller/CRM/Email/fetchEmails';
import getEmailsByAddress from '../controller/CRM/Email/GetEmailsbyAddress';
// import subscribe from '../controller/AceHr/Auth/subscribe';
import createPost from '../controller/CRM/Social Media/facebookController';
import { createLinkedInPost, getLinkedInAccessToken, getLinkedInAuthUrl } from '../controller/linkedin/linkedinController';
import sendEmail from '../controller/CRM/Email/sendEmail';
// const { sendOTP, verifyOTP, generateOTP } = require('./passwordless');
// import {sendOTP, verifyOTP, generateOTP} from './passwordless';








import updateCompanyByCompany from '../controller/AceERP/Auth/updateCompanyByCompany';
import assignSalaryScale from '../controller/salaryScale/assignSalaryScale';
import deleteRolePermissions from '../controller/AceERP/Auth/deleteRolePermission';
import syncCompanyFeaturesToRoles from '../controller/AceERP/Auth/syncCompanyFeaturesToRoles';
import deletePayrollPeriod from '../controller/Payroll/deletePeriod';
import createSubPlan from '../controller/AceERP/Auth/createSubPlan';
import fetchPlans from '../controller/AceERP/Auth/fetchPlans';
import fetchSubscriptions from '../controller/AceERP/Auth/fetchSubscriptions';
import fetchSubscriptionByCompany from '../controller/AceERP/Auth/fetchSubscriptionByCompany';
import editCompany from '../controller/AceERP/Auth/editCompany';
import addPermission from '../controller/AceERP/Auth/modules';
import role from '../controller/AceERP/Auth/roles';
import toggleModule from '../controller/AceERP/Auth/toggleModule';
import fetchModules from '../controller/AceERP/Auth/fetchModules';
import signInAceERP from '../controller/AceERP/Auth/signInAceErp';
import generatePasswordForAceERP from '../controller/AceERP/Auth/createAdmin';
import fetchAllCompanies from '../controller/AceERP/Auth/fetchAllCompanies';
import updateEmployeePermission from '../controller/RolesandPermissions/updateEmployeePermission';
import updateRoleAndPermissions from '../controller/RolesandPermissions/updateRoleandPermissions';
import subscribe from '../controller/AceERP/Auth/subscribe';
import companyId from '../controller/AceERP/Auth/companyId';





import createSalaryScale from '../controller/salaryScale/createSalaryScale';
import fetchSalaryScale from '../controller/salaryScale/fetchSalaryScale';
import deleteSalaryscale from '../controller/salaryScale/deleteSalaryscale';
import updateSalaryScale from '../controller/salaryScale/updateSalaryScale';






import { sendOTP } from './sendOTP';
import verifyOTP from './verifyOTP';

const { userValidationRules, validate } = require('../middleware/signUpValidation')
const multer = require("multer");
const mult = multer({ dest: "uploads/" });
const cloudinary = require("cloudinary").v2;
const Multer = require("multer");
const csv = require('csvtojson');

// Initialize Google Cloud Storage
// Multer configuration for file uploads
const multerConfig = multer.memoryStorage();

// Middleware for file uploads
const uploadgoogle = multer({
    storage: multerConfig,
    fileFilter: (req, file, cb) => {
        // Check file types here if needed
        console.log(req.files)
        cb(null, true);
    }
}).fields([
    { name: 'resumeCV', maxCount: 1 },
    { name: 'coverLetterFile', maxCount: 1 }
]);

// // Middleware for file uploads
// const uploadgooglesingle = multer({
//   storage: multerConfig,
//   fileFilter: (req, file, cb) => {
//       // Check file types here if needed
//       console.log(req.file)
//       cb(null, true);
//   }
// }).fields([
//   { name: 'attachment', maxCount: 1 },
// ]);



cloudinary.config({
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET,
  });

  
  const storage = new Multer.memoryStorage();
  const upload = Multer({
    storage,
  });

  const storagecsv = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });
  
  const uploadcsv = multer({ storage: storagecsv });

  async function handleUpload(file) {
    const res = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });
    return res;
  }

const router = express.Router();

router.post("/upload-cv", upload.single("payroll"), (req, res) => {
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

// router.use('/passwordless', );
// // req.isAuthenticated is provided from the auth router
// router.get('/', (req, res) => {
//   res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
// });

router.use('/socialMedia', require('./postRoutes'));

router.post('/singleSignOn', sendOTP);
router.post('/verifyOTP', verifyOTP);
router.get('/forgotPassword', forgotPassword);
router.patch('/changePassword', auth, changePassword);
router.patch('/verifyPassword', verifyToken);
router.post("/addImage", auth, upload.single("my_file"),  addImage);
// router.post("/jobApplication", auth, upload.single("resumeCV"), imageUploader, apply);
router.post("/jobApplication", auth, uploadgoogle,  async (req, res, next) => {
  try {
    console.log(req.files['resumeCV'][0])
      const resumeCV = req.files['resumeCV'][0];
      const coverLetterFile = req.files['coverLetterFile'][0];

      // Upload files to Google Cloud Storage
      await uploadFiles(req, resumeCV, 'resumeCV');
      await uploadFiles(req, coverLetterFile, 'otherFile');

     next()
  } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Error uploading files.");
  }
}, apply);
router.post('/addEmployee', auth, upload.single("profilePhoto"), imageUploader, inviteEmployee);
router.patch('/addLeaveType/:roleId', auth, addLeave);
// router.patch('/addHmo/:id', auth, addHmo);
router.patch('/addLeave/:id', auth, addDesignationLeave);
router.patch('/addHmo/:id', auth, addDesignationHmo);
router.post('/addCompany', addCompany);
router.post('/signin', signin);
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
// router.delete('/deleteDepartment/:id',auth, deleteDepartmimageUploader,ent);
router.post('/addTable', addTable);
router.patch('/addPayment',auth, addPayment);
router.post('/updatePayment', auth, updatePayment);
router.get('/fetchEmployees',auth,  fetchEmployees);
router.get('/fetchEmployee/:id', auth, fetchSpecificEmployees);
router.patch('/adminUpdateEmployee/:id', auth, upload.single("profilePhoto"), imageUploader,  updateEmployeeAdmin);

router.patch('/updateEmployee', auth, upload.single("profilePhoto"), imageUploader,  updateEmployee);
router.delete('/deleteEmployee/:id', auth, deleteEmployee);
router.get('/fetchDesignations', auth, fetchDesignation);
router.get('/listAuditTrails', auth, listAudits);
router.post("/uploadBulkEmployees", auth, mult.single("file"), bulkEmployee);
router.post("/verifyEmail", verifyNewUser);
router.post("/decodeEmail", verifyToken);
router.post("/setPassword", signDecode, verifyEmployee);
router.post("/createLeave", auth, createLeave);
router.post("/createExpenseType", auth, createExpense);
router.get("/getExpense/:id", auth, fetchExpenseDetails);
router.get("/getExpenseTypes", auth,fetchExpense);
router.delete("/deleteExpenseType/:id", auth,deleteExpense);
router.patch("/updateExpenseType/:id", auth,updateExpense);
router.get("/searchEmployee", auth, searchEmployee);
router.patch("/assignDepartmentManager", auth, assignManager);
router.patch("/assignManager", auth, assignManagerEmployee);
router.delete("/deleteLeave/:id", auth, deleteLeave);
router.patch("/updateLeave/:id", auth, updateLeave);
router.get("/fetchLeave", auth, fetchLeaves);
router.get("/fetchLeave/:id", auth, fetchLeavesDetails);
router.patch("/updateDesignation/:id", auth, updateDesignation);
router.delete("/deleteDesignation/:id", auth, deleteDesignation);
router.delete("/deleteDebit/:id", auth, deleteDebit);
router.delete("/deleteCredit/:id", auth, deleteCredit);
router.post("/leaveApplication", auth, leaveApplication);
router.patch("/leaveAction", auth, leaveAction);
router.get("/getLeaveRecords", auth, getLeaveRecords);
router.patch("/assignBulkDesignation", auth, assignDesignation);
router.get("/fetchRequestedLeaves", auth, getAdminRecords);
router.patch("/updateLeaveApplication/:id", auth, updateLeaveApplication);
router.delete("/deleteLeaveApplication/:id", auth, deleteLeaveApplication);
router.post("/createExpenseRequests", auth, upload.single("attachment"), imageUploader, createExpenseRequest);
router.get("/fetchExpenseRequests", auth, fetchExpenseReqs);
router.get("/getLeaveRecords/:id", auth, getLeaveRecordsDetails);
router.get("/fetchApprovalExpenseRequest", auth, fetchExpenseReqsAdmin);
router.post("/createKpiGroups", auth, createGroup);
router.post("/createKpis", auth, createKPI);
router.post("/createRating", auth, createRating);
router.post("/createAppraisalPeriod", auth, createPeriod);
router.post("/createAppraisal", auth, createFinal);
router.patch("/assignKpis", auth, assignKpis);
router.get("/fetchAppraisalGroups", auth, fetchGroups);
router.get("/fetchKPIs", auth, fetchKPIs);
router.get("/fetchRatings", auth, fetchRatings);
router.get("/fetchAppraisals", auth, fetchFinal);
router.get("/fetchPeriod", auth, fetchPeriod);
router.get("/fetchGroupByEmployee", auth, fetchGroupsByEmployee);
router.get("/fetchGroupByDesignation/:designation", auth, fetchGroupsByDesignations);
router.get("/fetchGroupByDepartment/:department", auth, fetchGroupsByDepartment);
router.get("/fetchAppraisalRequests", auth, fetchFinalManager);
router.get("/fetchApprovedLeaveRequests/:id", auth, getAdminApprovedRecords);
router.patch("/updateKPIs/:id", auth, updateKPI);
router.patch("/updatePeriod/:id", auth, updatePeriod);
router.patch("/updateRating/:id", auth, updateRating);
router.patch("/updateGroup/:id", auth, updateGroup);
router.patch("/updateAppraisal/:id", auth, updateFinal);
router.patch("/assignAppraisalToDepartment", auth, assignGroupsDepartment);
router.patch("/assignAppraisalToDesignations", auth, assignGroupsDesignation);
router.patch("/assignAppraisalToEmployees", auth, assignGroupsEmployees);
router.patch("/updateExpenseRequest/:id", auth, upload.single("attachment"), imageUploader, updateExpenseRequest);
router.patch("/expenseAction", auth, approveExpense);
router.post("/employeeFillAppraisal", auth, fillAppraisal);
router.get("/fetchApprovalRequests/:id", auth, fetchRequests);
router.get("/fetchEmployeesByDepartment", auth, fetchEmployeesByDepartment);
router.get("/fetchApprovedLeaveRequests", auth, approvedRequests);
router.delete("/deleteKPI/:id", auth, deleteKPI);
router.delete("/deletePeriod/:id", auth, deletePeriod);
router.delete("/deleteRating/:id", auth, deleteRating);
router.delete("/deleteGroup/:id", auth, deleteGroup);
router.delete("/deleteAppraisal/:id", auth, deleteFinal);
router.delete("/deleteCompany", auth, deleteCompany);
router.delete("/deleteExpenseRequest/:id", auth, deleteExpenseRequest);
router.delete("/deletePayrollPeriod/:id", auth, deletePeriod);
router.post("/createRole", auth, createRole);
router.post("/createPermissions", auth, createPermissions);
router.get("/fetchPermissions", auth, fetchPermissions);
router.patch("/assignRole", auth, assignRole);
router.get("/fetchRoles", auth, fetchRoles);
router.post("/createCredits", auth, createCredits);
router.post("/createDebits", auth, createDebits);
router.post("/createPayrollPeriod", auth, createPayrollPeriod);
router.get("/fetchCredits", auth, fetchCredits);
router.get("/fetchDebits", auth, fetchDebits);
// router.get("/fetchPayrollPeriods", auth, fetchPayrollPeriod);
router.patch("/updateCredits/:id", auth, updateCredits);
router.patch("/updateDebits/:id", auth, updateDebits);
router.patch("/updatePayrollPeriod/:id", auth, updatePayrollPeriod);
router.post("/createPermissions", auth, createPermissions);
router.get("/fetchPermissions", auth, fetchPermissions);
router.patch("/assignRole", auth, assignRole);
router.get("/fetchRoles", auth, fetchRoles);
router.get("/fetchPayroll", auth, fetchPayroll);
router.get("/fetchEmployeesByDepartment", auth, fetchEmployeesByDepartment);
router.patch("/updatePayrollStatus", auth, updatePayrollStatus);
router.get("/payrollGraph/:year", auth, payrollGraph);
router.post("/uploadPayroll/:id", auth, mult.single("file"), createPeriodPayData);
router.get("/totalEarnings", auth, totalEarnings);
router.get("/totalnetEarnings", auth, netSalary);
router.get("/fetchPayrollPeriods", auth, fetchPayrollPrd);
router.get("/fetchPayrollPeriodDetails/:id", auth, fetchPayrollPeriodDetails);
router.get("/leaveStats", auth, leaveDetails);
router.get("/expenseGraph/:year", auth, expenseGraph);
router.patch("/updatePayrollEntry/:id", auth, updatePeriodData);
router.patch("/addPayment/:id", auth, addPaymentAdmin);
router.post("/createHoliday", auth, createHoliday);
router.patch("/updateHoliday/:id", auth, updateHoliday);
router.get("/fetchHolidays", auth, fetchHoliday);
router.get("/fetchHoliday/:id", auth, fetchHolidayDetails);
router.delete("/deleteHoliday/:id", auth, deleteHoliday);
router.patch("/assignApprover", auth, assignApproval);
router.patch("/setExpense",  setExpense);
router.patch("/managerRateKpi/:id",  auth, rateKPI);
router.post("/employeeRequestAppraisal", auth, employeeKPI);
router.get("/fetchAppraisalPeriod/:id", auth, fetchAppraisalPeriodDetails);
router.get("/fetchGroupDetails/:employeeId/:appraisalPeriodId", auth, fetchGroupsByPeriod);
router.post("/createMeeting", auth, createMeeting);
router.patch("/updateMeeting/:id", auth, updateMeeting);
router.get("/fetchMeetings", auth, fetchMeeting);
router.get("/fetchMeeting/:id", auth, fetchMeetingDetails);
router.delete("/deleteMeeting/:id", auth, deleteMeeting);
router.get("/fetchCalendar", auth, calender);
router.post("/bookVisitor", auth, createVisit);
router.patch("/updateVisit/:id", auth, updateVisitor);
router.get("/fetchVisits", auth, fetchVisits);
router.patch("/checkIn/:id", auth, checkIn);
router.patch("/checkOut/:id", auth, checkOut);
router.post("/createJobListing", auth, createJobListing);
router.post("/createForm", auth, createForm);
router.patch("/updateForm", auth, updateForm);
router.get("/fetchJobListings", auth, fetchJobListings);
router.get("/fetchJobListing/:id", auth, fetchJobListingDetails);
router.patch("/fetchJobListing/:id", auth, updateJobListing);
router.patch("/publishJob/:id", auth, publishJobListing);
router.delete("/deleteJobListing/:id", auth, deleteJobListing);
router.post("/createForm", auth, createForm);
router.patch("/updateForm/:id", auth, updateForm);
router.patch("/selectApplication/:id", auth, selectApplication);
router.get("/listJobApplications/:jobTitleID", auth, listApplications);
router.get("/fetchSelectedApplicants/:id", auth, fetchSelectedApplications);
router.post("/createGoogleMeeting", zoomIntegration);
router.get("/fetchNotifications", auth, fetchNotifications);
router.patch("/markAsRead/:id", auth, readNotification);
router.patch("/changeStageStatus/:id", auth, changeStage);
router.get("/exportEmployees", auth, exportEmployees);
router.patch("/checkInOut", auth, checkInOut);
// router.get("/fetchAttendance", auth, fetchAttendance);
router.get("/masterList", auth, listMasterApplications);
router.post("/attendanceSheet", dailyAttendance);
router.get("/fetchAttendance", auth, fetchTodaysAttendance);
// router.get("/fetchAttendance", auth, mult.single("file"), createOfferLetter);


router.post("/createContact",upload.single("profilePhoto"), createContact);
router.post("/addContactActivity/:contactId",auth, addActivity);
router.delete("/deleteContactActivity/:contactId/:activityId",auth, deleteActivity);
router.post("/addContactNote/:contactId",auth, mult.single("file"), addNotes);
router.delete("/deleteContactNote/:contactId/:noteId",auth, deleteNote);
router.get("/fetchContacts",auth, fetchContact);
router.get("/fetchContact/:id",auth, fetchSingleContact);
router.patch("/updateContact/:contactId",auth, updateContact);
router.delete("/deleteContact/:contactId",auth,deleteContact);

router.post("/createLead",auth, upload.single("profilePhoto"), createLead);
router.post("/addLeadActivity/:leadId",auth, addLeadActivity);
router.delete("/deleteLeadActivity/:leadId/:activityId",auth, deleteLeadActivity);
router.post("/addLeadNote/:leadId",auth, upload.single('attachment'), addLeadNotes);
router.delete("/deleteLeadNote/:leadId/:noteId",auth, deleteLeadNote);
router.get("/fetchLeads",auth, fetchLeads);
router.get("/fetchLead/:id",auth, fetchSingleLead);
router.patch("/updateLead/:leadId",auth, updateLead);
router.delete("/deleteLead/:leadId",auth, deleteLead);

router.post("/createTicket",auth, upload.single("attachment"), createTicket);
router.post("/addTicketActivity/:ticketId",auth, addTicketActivity);
router.delete("/deleteTicketActivity/:ticketId/:activityId",auth, deleteTicketActivity);
router.post("/addTicketNote/:ticketId",auth, upload.single("file"), imageUploader, addTicketNotes);
router.delete("/deleteTicketNote/:ticketId/:noteId",auth, deleteTicketNote);
router.get("/fetchTickets",auth, fetchTicket);
router.get("/fetchTicket/:id",auth, fetchSingleTicket);
router.patch("/updateTicket/:ticketId",auth, updateTicket);
router.delete("/deleteLead/:ticketId",auth, deleteTicket);

router.post("/createAgent",auth,createAgent);
router.patch("/updateAgent/:id",auth,updateAgent);
router.delete("/deleteAgent/:id",auth,deleteAgent);
router.get("/fetchAgents",auth,fetchAgents);
router.patch("/fetchAgents",auth,addAgentActivity);
router.post("/createQuotation", auth, createQuotation);
router.post("/createPurchaseOrder", auth, createPurchaseOrder);
router.post("/createInvoice", auth, createInvoice);

router.get("/fetchContactInvoice/:id", auth, fetchInvoiceContact);
router.get("/fetchContactPurchaseOrders/:id", auth, fetchPurchaseOrder);
router.get("/fetchContactQuotations/:id", auth, fetchQuotation);
router.get("/payrollYears", auth, payrollYears);

router.get("/fetchEmails", fetchEmails);
router.get("/fetchEmailsByAddress/:email", getEmailsByAddress);
router.post("/sendEmail", sendEmail);

router.patch('/updateContactPicture/:contactId', auth, upload.single("profilePhoto"), imageUploader, contactPicture);
router.patch('/updateLeadPicture/:leadId', auth, upload.single("profilePhoto"), imageUploader, leadPicture);
router.patch('/updateAgentPicture/:agentId', auth, upload.single("profilePhoto"), imageUploader, agentPicture);

















router.get('/fetchAllCompanies', auth, fetchAllCompanies);
router.put('/update-permissions', auth, updateEmployeePermission); 
router.put('/updateRole', auth, updateRoleAndPermissions);
// router.post('/subscribe', auth, subscribe);
router.get('/companyId/:companyId', auth, companyId);
router.post('/createPost', createPost);
router.post('/linkedin/callback', getLinkedInAccessToken);
router.post('/createLinkedInPost', createLinkedInPost);
router.get('/linkedin/auth-url', getLinkedInAuthUrl);




router.patch('/editCompany/:id', auth, editCompany);
router.post('/createPermission', auth, addPermission);
router.get('/fetchModules', auth, fetchModules);
// router.get('/fetchModule/:id', auth, moduleController.fetchModule);
router.post('/createRole', auth, role);
// router.get('/roles', auth, fetch);
router.patch('/updatePermissions', auth, toggleModule);
router.get('/subscriptionPlans', fetchPlans);
router.post('/subscribe', subscribe);
router.get('/subscriptions', fetchSubscriptions);
router.get('/subscriptions/company/:companyId', fetchSubscriptionByCompany);








router.post('/createAdminAceERP', generatePasswordForAceERP);
router.delete('/deleteRolePermissions/:companyId', auth, deleteRolePermissions);
router.patch('/updateCompany/:id', auth, updateCompanyByCompany);
router.post('/sync-company-features', syncCompanyFeaturesToRoles);
router.post('/createSubPlan', createSubPlan);
router.patch('/assignSalaryScale', auth, assignSalaryScale);
router.post('/signInAdmin', signInAceERP);



router.delete("/deletePayrollPeriod/:id", auth, deletePayrollPeriod);


router.post('/createSalaryScale', auth,  createSalaryScale);
router.get('/fetchSalaryScale', auth,  fetchSalaryScale);
router.delete('/deleteSalaryScale/:id', auth, deleteSalaryscale);
router.patch('/updateSalaryScale/:id', auth, updateSalaryScale);


export default router;