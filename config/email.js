import nodemailer, { Transporter } from 'nodemailer';

// Define an email configuration object
const emailConfig = {
	host: process.env.SMTP_HOST,
	port: process.env.SMTP_PORT,
	secure: false,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD
  },
};

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport(emailConfig);

// Function to send an email
export const sendEmail = async (
  to,
  subject,
  html
) => {
  try {
    // Send an email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM, // Sender's email address
      to, // Recipient's email address
      subject, // Email subject
      html, // HTML version of the email (optional)
    });

    console.log('Email sent successfully.');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
