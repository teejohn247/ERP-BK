import mongoose from 'mongoose';

const LeaveRecordsSchema = new mongoose.Schema({

    fullName:{
        type:String,
        required:true
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
    approved:{
        type: Boolean,
        default: false
    },
    department:{
        type:String,
    },
    companyRole:{
        type:String,
    },
    creationDate:{
        type: Date,
        default: new Date()
    }
});

const LeaveRecords = mongoose.model("leaverecords", LeaveRecordsSchema);
export default LeaveRecords;

