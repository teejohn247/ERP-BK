
import dotenv from 'dotenv';
import Role from '../../model/Role';
import Company from '../../model/Company';
import Holiday from '../../model/Meetings';
import Employee from '../../model/Employees';
import zoomIntegration from '../../helpers/zoomIntegration';




const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const createMeeting = async (req, res) => {

    try {
       
        const { location, meetingStartTime, meetingEndTime, meetingTitle, meetingDescription, invitedGuests } = req.body;
     
        let emp = await Employee.findOne({ _id: req.payload.id });
        let comp = await Company.findOne({ _id: req.payload.id });


        console.log({emp})

        if(emp){

            let company = await Company.findOne({ _id: emp.companyId });
            console.log({company})
    
            if(!meetingStartTime){
    
                res.status(400).json({
                    status: 400,
                    error: 'meetingStartTime is required'
                })
                return;
            }
    
            let groups = [];
        
            for (const groupId of invitedGuests) {
                console.log({ groupId });
        
                try {
                    const group = await Employee.findOne({ email: groupId });
    
                    console.log({group})
                    
                    groups.push({
                        employeeId: groupId,
                        employeeName: group.fullName,
                        profilePics: group.profilePic
                    });
                    console.log({ group });
                } catch (err) {
                    console.error(err);
                }
            }
            const meetingStartTimeZoom = new Date(meetingStartTime);
            const meetingEndTimeZoom = new Date(meetingEndTime);
    
            // Calculate the difference in milliseconds
            const durationInMilliseconds = meetingEndTimeZoom - meetingStartTimeZoom;
    
            // If you need the duration in seconds
            const durationInSeconds = durationInMilliseconds / 1000;
    
            // If you need the duration in minutes
            const durationInMinutes = durationInSeconds / 60;
    
            // If you need the duration in hours
            const durationInHours = durationInMinutes / 60;
    
            // If you need the duration in days
            const durationInDays = durationInHours / 24;
    
            console.log("Duration in milliseconds:", durationInMilliseconds);
            console.log("Duration in seconds:", durationInSeconds);
            console.log("Duration in minutes:", durationInMinutes);
            console.log("Duration in hours:", durationInHours );
            console.log("Duration in days:", durationInDays);
    
            if(location == "online"){
                var zoomLink = await zoomIntegration(meetingStartTime, durationInHours ? Number(durationInHours) : 1, meetingTitle)
            }
    
            
            console.log({
                location,
                meetingStartTime,
                meetingEndTime,
                meetingTitle,
                meetingDescription,
                invitedGuests: groups,
                companyId: emp.companyId,
                companyName: company.companyName,
                employeeId: req.payload.id,
                zoomLink: zoomLink && zoomLink
               
            })
           let holiday = new Holiday({
                location,
                meetingStartTime,
                meetingEndTime,
                meetingTitle,
                meetingDescription,
                invitedGuests: groups,
                companyId: emp.companyId,
                companyName: company.companyName,
                employeeId: req.payload.id,
                zoomLink: zoomLink && zoomLink
               
            })
            
            await holiday.save().then((adm) => {
                console.log(adm)
                res.status(200).json({
                    status: 200,
                    success: true,
                    data: adm
                })
            }).catch((err) => {
                    console.error(err)
                    res.status(400).json({
                        status: 400,
                        success: false,
                        error: err
                    })
                })

        }
        else if(comp){

            let company = await Company.findOne({ _id: req.payload.id });
            console.log({company})
    
            if(!meetingStartTime){
    
                res.status(400).json({
                    status: 400,
                    error: 'meetingStartTime is required'
                })
                return;
            }
    
            let groups = [];
        
            for (const groupId of invitedGuests) {
                console.log({ groupId });
        
                try {
                    const group = await Employee.findOne({ email: groupId });
    
                    console.log({group})
                    
                    groups.push({
                        employeeId: groupId,
                        employeeName: group.fullName,
                        profilePics: group.profilePic
                    });
                    console.log({ group });
                } catch (err) {
                    console.error(err);
                }
            }
            const meetingStartTimeZoom = new Date(meetingStartTime);
            const meetingEndTimeZoom = new Date(meetingEndTime);
    
            // Calculate the difference in milliseconds
            const durationInMilliseconds = meetingEndTimeZoom - meetingStartTimeZoom;
    
            // If you need the duration in seconds
            const durationInSeconds = durationInMilliseconds / 1000;
    
            // If you need the duration in minutes
            const durationInMinutes = durationInSeconds / 60;
    
            // If you need the duration in hours
            const durationInHours = durationInMinutes / 60;
    
            // If you need the duration in days
            const durationInDays = durationInHours / 24;
    
            if(location == "online"){
                var zoomLink = await zoomIntegration(meetingStartTime, durationInHours ? Number(durationInHours) : 1, meetingTitle)
            }
    
         
           let holiday = new Holiday({
                location,
                meetingStartTime,
                meetingEndTime,
                meetingTitle,
                meetingDescription,
                invitedGuests: groups,
                companyId: req.payload.id,
                companyName: comp.companyName,
                employeeId: req.payload.id,
                zoomLink: zoomLink && zoomLink
               
            })
            
            await holiday.save().then((adm) => {
                console.log(adm)
                res.status(200).json({
                    status: 200,
                    success: true,
                    data: adm
                })
            }).catch((err) => {
                    console.error(err)
                    res.status(400).json({
                        status: 400,
                        success: false,
                        error: err
                    })
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
export default createMeeting;



