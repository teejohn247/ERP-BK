
import dotenv from 'dotenv';
import Employee from '../../model/Employees';



dotenv.config();


const fetchSpecificEmployees = async (req, res) => {

    try {


        const employee = await Employee.find({_id: req.params.id})


        if(!employee){
            res.status(404).json({
                status:404,
                success: false,
                error:'No employee Found'
            })
            return
        }else{
            res.status(200).json({
                status: 200,
                success: true,
                data: employee,
            })
        }

    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })
    }
}
export default fetchSpecificEmployees;



