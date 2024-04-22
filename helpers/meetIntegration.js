// const { google } = require('googleapis');
// const { JWT } = require('google-auth-library');

const credentials = require('../middleware/ivory.json');

// const meetIntegration = () => {
//     console.log('here')

// const jwtClient = new JWT({
//   email: credentials.client_email,
//   key: credentials.private_key,
//   scopes: ['https://www.googleapis.com/auth/calendar'], // You can add more scopes as needed
// });

// console.log({jwtClient})

// // Authorize the client
// jwtClient.authorize((err, tokens) => {
//   if (err) {
//     console.error('Authentication error:', err);
//     return;
//   }

//   // Your Google Meet API calls go here
//   // Example: Create a new meeting
//   const meet = google.meet({ version: 'v1', auth: jwtClient });
//   meet.events.create(
//     {
//         requestBody: {
//           summary: 'Meeting Title',
//           description: 'Description of the meeting',
//           start: {
//             dateTime: '2024-04-16T10:00:00', // Start time of the meeting in ISO 8601 format
//             timeZone: 'Africa/Lagos', // Time zone of the meeting
//           },
//           end: {
//             dateTime: '2024-04-16T11:00:00', // End time of the meeting in ISO 8601 format
//             timeZone: 'Africa/Lagos', // Time zone of the meeting
//           },
//           attendees: [
//             { email: 'attendee1@example.com' },
//             { email: 'attendee2@example.com' },
//             // Add more attendees as needed
//           ],
//           // Additional meeting options/settings can be included here
//         },
//       },
//     (err, response) => {
//       if (err) {
//         console.error('Error creating meeting:', err);
//         return;
//       }
//       console.log('Meeting created:', response.data);
//     }
//   );
// });
// }

// export default meetIntegration;

const meetIntegration = () => {
const Meeting = require('google-meet-api').meet

Meeting({
    clientId : credentials.client_id,
    clientSecret : credentials.clientSecret,
    refreshToken : "1//04l_7d3IaKGCRCgYIARAAGAQSNwF-L9Ireo7El9OVo4iQLbH5RqEUCao019cZSYs_GwvP4_hlwbdsgVOdIzKAM9Kzr5Ay2X_4ZR0",
    date : "2020-12-01",
    time : "10:59",
    summary : 'summary',
    location : 'location',
    description : 'description'
    }).then(function(result, err){
        if(result){
            console.log(result);//result it the final link

        }else{
            console.log(err);//result it the final link

        }
    })

}

export default meetIntegration;