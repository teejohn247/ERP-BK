import mongoose from 'mongoose';

const LeaveRecordsSchema = new mongoose.Schema({

    fullName:{
        type:String,
        required:true
    },
    employeeImage:{
        type:String,
    },
    companyId:{
        type:String,
        required:true
     },
     companyName:{
        type:String,
        required:true
    },
    userId:{
       type:String,
       required:true
    },
     leaveTypeId: {
        type: String,
       required:true

    },
    leaveTypeName: {
        type: String,
       required:true

    },
    leaveStartDate: {
        type: String,
       required:true
    },
    leaveEndDate: {
        type: String,
       required:true
    },
    assignedNoOfDays: {
        type: Number,
    },
    daysUsed: {
        type: Number,
    },
    leaveApprover: {
        type: String,
        required:true
    },
    approver: {
        type: String,
        required:true
    },
    approved:{
        type: Boolean,
        default: false
    },
    leaveStatus:{
        type: String,
        default: "Pending"
    },
    department:{
        type:String,
    },
    requestMessage:{
        type:String,
    },
    decisionMessage:{
        type:String,
    },
    companyRole:{
        type:String,
    },
    requestDate:{
        type: Date,
        default: new Date()
    }
});

const LeaveRecords = mongoose.model("leaverecords", LeaveRecordsSchema);
export default LeaveRecords;

