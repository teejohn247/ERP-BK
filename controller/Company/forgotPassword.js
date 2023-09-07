
import dotenv from 'dotenv';
import Admin from '../../model/Company';
// import utils from '../../config/utils';
import HTTP_STATUS from 'http-status-codes';
import {emailTemp} from '../../emailTemplate';
import utils from '../../config/utils';
import { sendEmail } from '../../config/email';


// eslint-disxzable-next-line @typescript-eslint/no-var-requires
dotenv.config();


const forgotPassword = async (req, res) => {

    try {

			const { email } = req.body;

			const user = await Admin.findOne({ email });
			if(!user){
				res.status(401).json({
					status: 401,
					success: false,
					error: 'User does not exist'
				})

				return;
			}
	       const token = utils.encodeToken(user._id, user.isSuperAdmin, user.adminEmail);

      const msg = `<div>
        <p style="padding: 32px 0; font-weight: 700; font-size: 20px;font-family: 'DM Sans';">
        Hi ${ user?.firstName && user?.firstName },
        </p>

        <p style="font-size: 16px;font-weight: 300;">
        <br>

        Please, complete your reset your password using this link
        <br>
				<a href="localhost:3000/resetPassword?token=${token}"><button>Reset Password</button></a>
        localhost:3000/resetPassword?token=${token}

        <br><br>
        </p>
        <div>`;

      const message = emailTemp(
        msg,
        'Password Reset'
      );

			sendEmail(email, 'Password Reset', message);

			res.status(HTTP_STATUS.CREATED).json({
				status: HTTP_STATUS.CREATED,
				success: true,
				data: 'An email has been sent to change your password'
			});
	}catch(error){
			res.status(500).json({
					status: 500,
					success: false,
					error:'server error'
			});
	};
};
export default forgotPassword;
