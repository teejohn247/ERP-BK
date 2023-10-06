
import dotenv from 'dotenv';
import Employee from '../../model/Employees';
import Department from '../../model/Department';


const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const fetchDepartment = async (req, res) => {

    try {

        const { page, limit } = req.query;

        const department = await Department.find({companyId: req.payload.id})
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

        const count = await Department.find({companyId: req.payload.id}).countDocuments()
        res.status(200).json({
            status: 200,
            success: true,
            data: department,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        })

        return;

        // if(department.length < 1){
        //     res.status(404).json({
        //         status:404,
        //         success: false,
        //         error:'No department Found'
        //     })
        //     return
        // }else{
        //     res.status(200).json({
        //         status: 200,
        //         success: true,
        //         data: department,
        //         totalPages: Math.ceil(count / limit),
        //         currentPage: page
        //     })
        // }

    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })
    }
}
export default fetchDepartment;



