// import Lecture from '../model/Lecture';
import jwt from 'jsonwebtoken';
// import nodemailer from "nodemailer";

import dotenv from 'dotenv';
import moment from 'moment';
const request = require("request");

import axios from 'axios'

// let transporter = nodemailer.createTransport({
//    service: 'gmail',
//    host: "smtp.gmail.com",
//    secure: false,
//     auth: {
//       user: process.env.NODE_MAILER_EMAIL,
//       pass: process.env.NODE_MAILER_PASSWORD,
//     },
//   });


dotenv.config();



const email = process.env.ZOOM_EMAIL
const apiKey = process.env.ZOOM_API_KEY
const secret = process.env.ZOOM_API_SECRET


const zoomIntegration = async (time, duration, topic) => {

  try {

    const username =  process.env.ZOOM_CLIENT_ID
    const password = process.env.ZOOM_CLIENT_SECRET
    const auth_token_url = "https://zoom.us/oauth/token"
    const api_base_url = "https://api.zoom.us/v2"

    let zoom;
    const base64Credentials = Buffer.from(`${username}:${password}`).toString('base64');




    const authResponse = await axios.post(`${auth_token_url}?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`,
     {
      grant_type: 'account_credentials',
      account_id:  process.env.ZOOM_ACCOUNT_ID,
      client_secret:  process.env.ZOOM_CLIENT_SECRET
  }, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': `Basic ${base64Credentials}`,
      },
     
  })
  .then(async response => {
    // Handle the response
    const access_token = response.data.access_token;

  
    const headers = {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json'
    };
  
    const payload = {
      topic: topic,
      duration: duration,
      start_time: time,
      type: 2
  };
  
  const meetingResponse = await axios.post(`${api_base_url}/users/me/meetings`, payload, { headers });

  
  if (meetingResponse.status !== 201) {
      console.log('Unable to generate meeting link');
      res.status(400).json({
        status: 400,
        success: false,
        error: "Unable to generate meeting link"
    })
      return;
  }
  
  const response_data = meetingResponse.data;
  


  zoom =meetingResponse.data;

  return response_data;


  })
  .catch(error => {
    // Handle errors
    console.error(error);
    res.status(400).json({
      status: 400,
      success: false,
      error: error
  })
  });

  return zoom

} catch (error) {
    res.status(500).json({
        status: 500,
        success: false,
        error: error
    })
}
}
export default zoomIntegration;
