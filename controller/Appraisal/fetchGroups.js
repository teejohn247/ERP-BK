
import dotenv from 'dotenv';
import Role from '../../model/AppraisalGroup';



const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const fetchGroups = async (req, res) => {

    try {

        const { page, limit } = req.query;


           // Fetch documents with "general" first, followed by other names, and then "specific" last
           const role = await Role.find({companyId: req.payload.id,
            $or: [
                { groupName: 'general' },
                { groupName: { $nin: ['general', 'specific'] } },
                { groupName: 'specific' }
            ]
        }).sort({
            name: 1, // Sort in ascending order, adjust as needed
        }).limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

        console.log({role})


        // const role = await Role.find({companyId: req.payload.id}).sort({_id: -1})
        // .limit(limit * 1)
        // .skip((page - 1) * limit)
        // .exec();

        const count = await Role.find({companyId: req.payload.id}).countDocuments()
        console.log(role)
        res.status(200).json({
            status: 200,
            success: true,
            data: role,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });

    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })
    }
}
export default fetchGroups;



