import Company from '../../../model/Company';

const companyId = async (req, res) => {
    try {
        const { companyId } = req.params;

        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                status: 404,
                success: false,
                errorMessage: 'Company not found'
            });
        }

        return res.status(200).json({
            status: 200,
            success: true,
            data: company
        });

    } catch (error) {
        console.error('Get company error:', error);
        return res.status(500).json({
            status: 500,
            success: false,
            error: error.message
        });
    }
};

export default companyId;
