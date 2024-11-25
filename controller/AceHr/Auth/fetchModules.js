import Modules from '../../../model/Modules';

const fetchModules = async (req, res) => {
    try {
        const moduleDoc = await Modules.findOne();
        if (!moduleDoc) {
            return res.status(404).json({
                success: false,
                message: 'No modules configuration found'
            });
        }

        res.status(200).json({
            success: true,
            data: moduleDoc.modules
        });

    } catch (error) {
        console.error('Error in fetchModules:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching modules',
            error: error.message
        });
    }
};

export default fetchModules;
