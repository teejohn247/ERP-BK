
import dotenv from 'dotenv';
import JobPost from '../../model/Form';
import Company from '../../model/Company';
import Employee from '../../model/Employees';




const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const fetchSelectedApplications = async (req, res) => {

    try {

        const { page, limit } = req.query;

        const company = await Company.findOne({_id: req.payload.id});
        const employee = await Employee.findOne({_id: req.payload.id});

        console.log({company})
        console.log({employee})





        if(company) {
            const jobListing = await JobPost.find({companyId: req.payload.id, jobTitleID: req.params.id,  selected: true})
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
    
                const count = await JobPost.find({companyId: req.payload.id,  jobTitleID: req.params.id, selected: true}).countDocuments()
    
                res.status(200).json({
                    status: 200,
                    success: true,
                    data: jobListing,
                    totalPages: Math.ceil(count / limit),
                    currentPage: page
                });
    
                return
        }else if(employee){
            console.log(employee.companyId)
            const jobListing = await JobPost.find({companyId: employee.companyId, jobTitleID: req.params.id, selected: true})
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

            console.log({jobListing})
    
                const count = await JobPost.find({companyId: employee.companyId,  jobTitleID: req.params.id, selected: true}).countDocuments()
    
                res.status(200).json({
                    status: 200,
                    success: true,
                    data: jobListing,
                    totalPages: Math.ceil(count / limit),
                    currentPage: page
                });
    
                return
        }

    
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })
    }
}
export default fetchSelectedApplications;