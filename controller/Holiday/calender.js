
import dotenv from 'dotenv';
import Role from '../../model/Role';
import Employee from '../../model/Employees';
import Holiday from '../../model/Holidays';
import Leave from '../../model/LeaveRecords';
import Meeting from '../../model/Meetings';
import mongoose from 'mongoose';





const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const calender = async (req, res) => {

    try {
       
        // const { holidayName, description, date } = req.body;

        const emp = await Employee.findOne({_id: req.payload.id})

        console.log({emp});
        // const aggregationResult = await Meeting.aggregate([
        //     {
        //         $match: {
        //             employeeId: req.payload.id      // Convert req.payload.id to ObjectId
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: 'holidays',
        //             localField: 'companyId',
        //             foreignField: 'companyId',
        //             as: 'holidays'
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: 'leaverecords',
        //             localField: 'employeeId',
        //             foreignField: 'userId',
        //             as: 'leaveRecords'
        //         }
        //     },
        //     {
        //         $group: {
        //             _id: '$employeeId',
        //             meetingDateTime: {
        //                 $push: {
        //                     dateTime: '$meetingDateTime',
        //                     invitedGuests: '$invitedGuests',
        //                     location: '$location'
        //                 }
        //             },
        //             leaveStartDates: {
        //                 $push: {
        //                     $cond: [
        //                         { $ne: ['$leaveRecords', []] },
        //                         { $map: { input: '$leaveRecords', as: 'record', in: { startDate: '$$record.leaveStartDate', endDate: '$$record.leaveEndDate' } } },
        //                         []
        //                     ]
        //                 }
        //             },
        //             holiday: { $addToSet: '$holidays' }
        //         }
        //     },
        //     {
        //         $project: {
        //             _id: 1,
        //             meetingDateTime: 1,
        //             leaveStartDates: {
        //                 $filter: { input: '$leaveStartDates', as: 'date', cond: { $ne: ['$$date', []] } }
        //             },
        //             holiday: { $filter: { input: '$holiday', as: 'h', cond: { $ne: ['$$h', []] } } }
        //         }
        //     }
        // ]);
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
                    location: '$location'
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
                companyId: emp.companyId
            }
        }
    ]);
console.log({holidays})
    // Look up leave records for the employee
    leaveRecords = await Leave.aggregate([
        {
            $match: {
                userId: req.payload.id

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

        
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })
    }
}
export default calender;



