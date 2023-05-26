
import dotenv from 'dotenv';
import Department from '../../model/Department';
import Company from '../../model/Company';



const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const addDepartment = async (req, res) => {

    try {

        const {departmentName} = req.body;
        let departmentN = await Department.findOne({ departmentName });
        let companyName = await Company.findOne({ _id: req.payload.id });



        if (departmentN) {

            res.status(400).json({
                status: 400,
                error: 'This department Name already exist'
            })
            return;
        }

       let department = new Department({
            departmentName,
            companyId: req.payload.id,
            companyName: companyName.companyName
            
        })


        await department.save().then((adm) => {

            // sgMail.send(msg)
            console.log(adm)
            res.status(200).json({
                status: 200,
                success: true,
                data: adm
            })
        }).catch((err) => {
                console.error(err)
                res.status(400).json({
                    status: 400,
                    success: false,
                    error: err
                })
            })
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })
    }
}
export default addDepartment;



