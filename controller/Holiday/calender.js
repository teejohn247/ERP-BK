
import dotenv from 'dotenv';
import Role from '../../model/Role';
import Employee from '../../model/Employees';
import Holiday from '../../model/Holidays';
import Leave from '../../model/LeaveRecords';
import Meeting from '../../model/Meetings';
import mongoose from 'mongoose';
import Company  from '../../model/Company';




const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const calender = async (req, res) => {

    try {
       
        // const { holidayName, description, date } = req.body;

        const emp = await Employee.findOne({_id: req.payload.id})
        const comp = await Company.findOne({_id: req.payload.id})


        console.log({emp});
        console.log({comp});


        if(emp){

// First, fetch meetings for the employee
const meetings = await Meeting.aggregate([
    {
        $match: {
            employeeId: req.payload.id
        }
    },
    {
        $group: {
            _id: '$employeeId',
            meetingDateTime: {
                $push: {
                    dateTime: '$meetingDateTime',
                    invitedGuests: '$invitedGuests',
                    meetingTitle: '$meetingTitle',
                    meetingDescription: '$meetingDescription',
                    location: '$location',
                    zoomLink: '$zoomLink',
                    meetingStartTime: '$meetingStartTime',
                    meetingEndTime: '$meetingEndTime'
                }
            }
        }
    }
]);

// Initialize arrays for holidays and leave records
let holidays = [];
let leaveRecords = [];

// If meetings exist for the employee, perform lookups for holidays and leave records
if (meetings.length > 0) {
    const employeeId = meetings[0]._id;

    // Look up holidays for the employee
    holidays = await Holiday.aggregate([
        {
            $match: {
                companyId: employeeId
            }
        }
    ]);

    // Look up leave records for the employee
    leaveRecords = await Leave.aggregate([
        {
            $match: {
                userId: req.payload.id
            }
        }
    ]);
} else {
    // If there are no meetings, still fetch holidays and leave records for the employee
    const employeeId =req.payload.id;


console.log(emp.companyId, '997')
    // Look up holidays for the employee
    holidays = await Holiday.aggregate([
        {
            $match: {
                companyId: emp.companyId,
            }
        }
    ]);
console.log({holidays})
    // Look up leave records for the employee
    leaveRecords = await Leave.aggregate([
        {
            $match: {
                userId: req.payload.id,
                approved: true
            }
        }
    ]);
}

// Combine the results and return
const aggregationResult = {
    meetings: meetings.length > 0 ? meetings[0].meetingDateTime : [],
    holidays: holidays,
    leaveRecords: leaveRecords
};

// Return the combined result
// aggregationResult;


res.status(200).json({
    status: 200,
    success: true,
    data: aggregationResult
})
}else if(comp){

    console.log('heer')
const meetings = await Meeting.aggregate([
    {
        $match: {
            companyId: req.payload.id,
            approved: true

        }
    },
    {
        $group: {
            _id: '$companyId',
            meetingDateTime: {
                $push: {
                    dateTime: '$meetingDateTime',
                    invitedGuests: '$invitedGuests',
                    meetingTitle: '$meetingTitle',
                    meetingDescription: '$meetingDescription',
                    location: '$location',
                    zoomLink: '$zoomLink',
                    meetingStartTime: '$meetingStartTime',
                    meetingEndTime: '$meetingEndTime'
                }
            }
        }
    }
]);

console.log({meetings})

// Initialize arrays for holidays and leave records
let holidays = [];
let leaveRecords = [];

 
    // If there are no meetings, still fetch holidays and leave records for the employee


    // Look up holidays for the employee
    holidays = await Holiday.aggregate([
        {
            $match: {
                companyId:req.payload.id
            }
        }
    ]);
console.log({holidays})
    // Look up leave records for the employee
    leaveRecords = await Leave.aggregate([
        {
            $match: {
                companyId: req.payload.id

            }
        }
    ]);


// Combine the results and return
const aggregationResult = {
    meetings: meetings.length > 0 ? meetings[0].meetingDateTime : [],
    holidays: holidays,
    leaveRecords: leaveRecords
};

// Return the combined result
// aggregationResult;


res.status(200).json({
    status: 200,
    success: true,
    data: aggregationResult
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
export default calender;



