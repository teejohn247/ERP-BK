// const { auth } = require('express-openid-connect');
// const { requiresAuth } = require('express-openid-connect');

// import express from 'express';

// const router = express.Router();

// const config = {
//   authRequired: false,
//   auth0Logout: true,
//   secret: 'a long, randomly-generated string stored in env',
//   baseURL: 'http://localhost:1000',
//   clientID: 'ahlnEd9A8EFj1Rc8CMyZUHgMBtjoMHaw',
//   issuerBaseURL: 'https://dev-f01zlg7oimf6v6kg.us.auth0.com'
// };

// // auth router attaches /login, /logout, and /callback routes to the baseURL
// router.use(auth(config));

// // req.isAuthenticated is provided from the auth router
// router.get('/', (req, res) => {
//     console.log(req.oidc)
//   res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
// });

// router.get('/profile', requiresAuth(), (req, res) => {

//     console.log(req.oidc.user)
//     res.send(JSON.stringify(req.oidc.user));
//   });

// module.exports = router;


import Otps from '../model/OtpModel.js';
import randomstring from 'randomstring';
import sendEmail from '../config/email';

// Generate OTP
function generateOTP() {
    return randomstring.generate({
        length: 6,
        charset: 'numeric'
    });
}

// Send OTP to the provided email
module.exports.sendOTP = async (req, res, next) => {
    try {
        const { email } = req.body;
        const otp = generateOTP(); // Generate a 6-digit OTP
        
        // Check if an OTP already exists for this email and delete it
        await Otps.deleteOne({ email });

        const newOTP = new Otps({ email, otp });
        await newOTP.save();

        const receivers = [{
            email: email,
            name: "Silo"
        }];

        // Send OTP via email
        await sendEmail(
            req, res,
            receivers,
            'Your OTP',
            `<p>Your OTP is: <strong>${otp}</strong></p>`,
        );

        res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

// Verify OTP provided by the user
module.exports.verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const existingOTP = await Otps.findOneAndDelete({ email, otp });

        if (existingOTP) {
            // OTP is valid
            res.status(200).json({ success: true, message: 'OTP verification successful' });
        } else {
            // OTP is invalid
            res.status(400).json({ success: false, error: 'Invalid OTP' });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

module.exports.generateOTP = generateOTP; 