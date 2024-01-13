
import dotenv from 'dotenv';
import Role from '../../model/Credits';
import Employee from '../../model/Employees';



const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const fetchCredits = async (req, res) => {

    try {

        const { page, limit } = req.query;


        const emp = await Employee.findOne({_id: req.payload.id})

        if(emp){

        const role = await Role.find({companyId: emp.companyId})
        .sort({_id: -1})
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

        const count = await Role.find({companyId: req.payload.id}).countDocuments()

        console.log(role)

        res.status(200).json({
            status: 200,
            success: true,
            data: role,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });

        } else{
            const role = await Role.find({companyId: req.payload.id})
            .sort({_id: -1})
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
    
            const count = await Role.find({companyId: req.payload.id}).countDocuments()
    
            console.log(role)
    
            res.status(200).json({
                status: 200,
                success: true,
                data: role,
                totalPages: Math.ceil(count / limit),
                currentPage: page
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })
    }
}
export default fetchCredits;



