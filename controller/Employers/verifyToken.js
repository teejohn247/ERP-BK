
import dotenv from 'dotenv';

dotenv.config();


const verifyToken = async (req, res) => {

    try {


        console.log(req.payload)

        res.status(200).json({
            status: 200,
            success: true,
            data: req.payload.email,
        })
        
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            error: error
        })
    }
}
export default verifyToken;
