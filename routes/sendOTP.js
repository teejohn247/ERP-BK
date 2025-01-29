import Otps from '../model/OtpModel.js';
import randomstring from 'randomstring';
import sendEmail from '../config/email';
import SibApiV3Sdk from 'sib-api-v3-sdk';


// Generate OTP
export function generateOTP() {
    return randomstring.generate({
        length: 6,
        charset: 'numeric'
    });
}

// Send OTP to the provided email
export const sendOTP = async (req, res, next) => {
    try {
        const { email } = req.body;
        const otp = generateOTP(); // Generate a 6-digit OTP
        
        // Check if an OTP already exists for this email and delete it
        await Otps.deleteOne({ email });


        const newOTP = new Otps({ email, otp });
        await newOTP.save();

        const receivers = [{
            email: email,
        }];
        console.log(email, otp)

    // Configure the Brevo API client
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    var apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.SMTP_API;

    // const response = await apiInstance.createEmailCampaign(emailCampaign);
    var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    const senders = {
      email: process.env.SMTP_USERNAME,
      name: 'Silo'
    }
    
    await apiInstance.sendTransacEmail({
      sender: senders,
      to: receivers,
      subject: 'Your OTP', // Email subject
      htmlContent: `<p>Your OTP is: <strong>${otp}</strong></p>`, // HTML version of the email (optional)
    }).then((response) => {
      console.log('Email sent successfully.', response);

    res.status(200).json({
      status: 200,
      success: true,
      message: 'OTP sent successfully',
      data: response,
    });

    })
  

  } catch (error) {
    console.error('Error in sendEmail:', error);
    res.status(500).json({
      status: 500, 
      success: false,
      error: 'An error occurred while sending OTP',
    });
  }
   
};

export default sendOTP;