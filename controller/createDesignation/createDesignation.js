
import dotenv from 'dotenv';
import Role from '../../model/Role';
import Company from '../../model/Company';
import Designation from '../../model/Designation';
import Leave from '../../model/Leaves';




const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const createDesignation = async (req, res) => {

    try {
       
        const {designationName, description, leaveAssignment} = req.body;


        let company = await Company.findOne({ _id: req.payload.id });

        let designation = await Designation.findOne({ companyId:company._id,  designationName: designationName });

        console.log({company})

        if (!company.companyName) {

            res.status(400).json({
                status: 400,
                error: 'No company has been created for this account'
            })
            return;
        }


        if (!leaveAssignment) {

            res.status(400).json({
                status: 400,
                error: 'Leave assignment field is compulsory'
            })
            return;
        }


        if (designation) {

            res.status(400).json({
                status: 400,
                error: 'This designation name already exist'
            })
            return;
        }

        const leaves = []
        const leaveTypes = []

        leaveAssignment.map((data, index) => {
            if(!data){
                res.status(400).json({
                    status: 400,
                    error: 'Leave id field is compulsory'
                })
                return;
            }
            leaves.push(data.leaveId)
        })

        leaves.map(async (data, index) => {
            const check = await Leave.findOne({_id: data});

            console.log({check})

            if(!check){
                res.status(400).json({
                    status: 400,
                    error: 'Leave type does not exist'
                })
                return;

            }else{
                leaveTypes.push({
                    leaveId: data,
                    leaveName: check.leaveName,
                    noOfLeaveDays: leaveAssignment[index].noOfLeaveDays,
                    paidLeave: leaveAssignment[index].paidLeave,
                })

                let designations = new Designation({
                    designationName,
                    companyId: req.payload.id,
                    companyName: company.companyName,
                    description,
                    leaveTypes
                })
        
                await designations.save().then((adm) => {
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
            }})

            console.log(leaveTypes)
      
 
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })
    }
}
export default createDesignation;



