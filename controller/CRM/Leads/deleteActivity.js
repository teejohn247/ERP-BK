import dotenv from 'dotenv';
import Contact from '../../../model/Contact';
import Company from '../../../model/Company';

dotenv.config();

const deleteActivity = async (req, res) => {
  try {
  const { contactId, activityId } = req.params;


     Contact.findOneAndUpdate({ _id:  contactId }, { 
        $pull: { activities: { _id: activityId
        }},
   },{ upsert: true },
        async function (
            err,
            result
        ) {
            if (err) {
                res.status(401).json({
                    status: 401,
                    success: false,
                    error: err
                })
            } else {
                res.status(200).json({
                    status: 200,
                    success: true,
                    data: 'Activity deleted'
                  });
            }
        })
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      error: error.message
    });
  }
};

export default deleteActivity;
