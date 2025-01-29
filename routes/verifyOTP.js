import Otps from '../model/OtpModel.js';
import Employee from '../model/Employees';
import bcrypt from 'bcrypt';
import utils from '../config/utils.js';

export const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    // Find the OTP document for the provided email
    const otpDoc = await Otps.findOne({ email });

    if (!otpDoc) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Invalid OTP',
      });
    }

    // Check if the provided OTP matches the stored OTP
    if (otpDoc.otp !== otp) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Invalid OTP',
      });
    }

    // Delete the OTP document after successful verification
    await Otps.deleteOne({ email });

const employee = await Employee.findOne({ email: email });

if(!employee){
  res.status(400).json({
      status: 400,
      error: `User with email: ${email} does not exist`
  })
  return;
}


    if(!employee.password){
      res.status(400).json({
          status: 400,
          success: false,
          error: 'Password not set'
      })
      return;
  }


  if (employee.firstTimeLogin == undefined) {

      await employee.updateOne({
          firstTimeLogin: true, 
      });
  }else if (employee.firstTimeLogin == true){
      await employee.updateOne({
          firstTimeLogin: false, 
      });

  }
  else if (employee.firstTimeLogin == false){
      await employee.updateOne({
          firstTimeLogin: false, 
      });
  }

  let company = await Employee.findOne({ email: email }).populate({
      path: 'companyId',
      select: 'subDomain'
  });

  const token = utils.encodeToken(employee._id, false, email, employee.companyId);


  res.status(200).json({
      status: 200,
      data: company,
      token: token,
  })



    

    // res.status(200).json({
    //   status: 200,
    //   success: true,
    //   message: 'OTP verified successfully',
    // });
  } catch (error) {
    console.error('Error in verifyOTP:', error);
    res.status(500).json({
      status: 500,
      success: false,
      error: 'An error occurred while verifying OTP',
    });
  }
};

export default verifyOTP;