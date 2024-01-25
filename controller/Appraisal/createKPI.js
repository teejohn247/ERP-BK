
import dotenv from 'dotenv';
import Role from '../../model/Role';
import Company from '../../model/Company';
import Leave from '../../model/Expense';
import AppraisalGroup from '../../model/Kpi';
import Group from '../../model/AppraisalGroup';





const sgMail = require('@sendgrid/mail')

dotenv.config();




sgMail.setApiKey(process.env.SENDGRID_KEY);



const createKPI = async (req, res) => {

    try {
       
        const { name, description, group, fields} = req.body;


        let company = await Company.findOne({ _id: req.payload.id });

        let appraisal = await AppraisalGroup.findOne({ companyId:company._id,  kpiName: name });

        console.log({appraisal})

        if (!company.companyName) {
            res.status(400).json({
                status: 400,
                error: 'No company has been created for this account'
            })
            return;
        }


        if (appraisal) {
            res.status(400).json({
                status: 400,
                error: 'This appraisal name already exist'
            })
            return;
        }

       let groups = new AppraisalGroup({
            kpiName: name,
            companyId: req.payload.id,
            companyName: company.companyName,
            description,
        })


        const dd = []
        await groups.save().then(async (adm) => {
            console.log(adm)

            let checks_group = await AppraisalGroup.find({ _id:  group},
                {groupKpis: { $elemMatch: { kpiId: adm._id } } })
    
                        checks_group.map((chk) => {
                            if(chk.groupKpis.length > 0){
                                dd.push(chk.groupKpis)
                            }
                        })
    
    
                if(dd.length > 0){
                    res.status(404).json({
                        status:404,
                        success: false,
                        error:'kpi has already been assigned to group'
                    })
                    return
                }
    
            Group.findOneAndUpdate({ _id: group }, { 
                $push: { groupKpis: {
                    kpiId: adm._id,
                    kpiName: name,
                    kpiDescription: description,
                    fields,
                    "remarks.employeeComment": "",
                    "remarks.managerName": "",
                    "remarks.employeeName": "",
                    "remarks.managerComment": "",
                    "remarks.managerOverallComment": "",
                    "remarks.managerRatingId": "",
                    "remarks.employeeRatingId": "",
    
    
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

                        console.log({result})
    
    
                    }
                })
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
export default createKPI;



