import SibApiV3Sdk from 'sib-api-v3-sdk';
import HTTP_STATUS from 'http-status-codes';

const sendEmail = async (req, res) => {
  try {
    const { name, subject, receivers,  html, listIds, scheduledAt } = req.body;

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
      subject, // Email subject
      htmlContent: html, // HTML version of the email (optional)
    }).then((response) => {
      console.log('Email sent successfully.', response);

    res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      success: true,
      message: 'Email sent successfully',
      data: response,
    });

    })
  

  } catch (error) {
    console.error('Error in sendEmail:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR, 
      success: false,
      error: 'An error occurred while creating the email campaign',
    });
  }
};

export default sendEmail;