import dotenv from 'dotenv';
import Role from '../../model/Role';
import Company from '../../model/Company';
import Leave from '../../model/Expense';
import AppraisalGroup from '../../model/Rating';
import Attendance from '../../model/StaffAttendance';
import Employee from '../../model/Employees';

const sgMail = require('@sendgrid/mail');
dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_KEY);

const checkInOut = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
        
        // First check if user exists
        let emp = await Employee.findOne({ _id: req.payload.id });
        
        if (!emp) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: 'Employee does not exist'
            });
        }
        
        // Find attendance record for today
        const att = await Attendance.findOne({
            employeeId: req.payload.id,
            createdAt: { $gte: today, $lt: tomorrow }
        });
        
        console.log('Current attendance record:', att);
        
        let currentTime = new Date();
        
        // If no attendance record exists for today, create one
        if (!att) {
            const newAttendance = new Attendance({
                employeeId: req.payload.id,
                employeeName: `${emp.firstName} ${emp.lastName || ''}`,
                companyId: emp.companyId,
                department: emp.department || '',
                checkIn: currentTime,
                checkOut: null,
                attendanceStatus: true
            });
            
            const savedAttendance = await newAttendance.save();
            
            return res.status(200).json({
                status: 200,
                success: true,
                message: 'Successfully checked in',
                data: savedAttendance
            });
        }
        
        // Attendance record exists, update it based on current status
        let updateQuery = {};
        
        if (att.attendanceStatus === true) {
            // Employee is currently checked in, so update check-out time
            updateQuery = {
                checkOut: currentTime,
                attendanceStatus: false
            };
        } else {
            // Employee is currently checked out, so update check-in time
            updateQuery = {
                checkIn: currentTime,
                checkOut: null,
                attendanceStatus: true
            };
        }
        
        const updatedAttendance = await Attendance.findByIdAndUpdate(
            att._id,
            updateQuery,
            { new: true }
        );
        
        if (!updatedAttendance) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: 'Failed to update attendance record'
            });
        }
        
        return res.status(200).json({
            status: 200,
            success: true,
            message: att.attendanceStatus ? 'Successfully checked out' : 'Successfully checked in',
            data: updatedAttendance
        });
    } catch (error) {
        console.error('Check In/Out Error:', error);
        return res.status(500).json({
            status: 500,
            success: false,
            message: 'Server error during check in/out process',
            error: error.message || 'Unknown error'
        });
    }
};

export default checkInOut;