import Role from '../../../model/Roles';
import Company from '../../../model/Company';

const toggleModule = async (req, res) => {
    try {
        const { companyId, roleIds, modules } = req.body;

        if (!companyId || !modules) {
            return res.status(400).json({
                success: false,
                message: 'CompanyId and modules are required'
            });
        }

        // First update company features
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found'
            });
        }

        // Update company features for each module
        for (const [moduleName, moduleConfig] of Object.entries(modules)) {
            if (company.companyFeatures.modules[moduleName]) {
                // Update main module settings
                if (moduleConfig.active !== undefined) {
                    company.companyFeatures.modules[moduleName].active = moduleConfig.active;
                }

                // Update submodule permissions
                Object.entries(moduleConfig).forEach(([subModuleName, subModuleConfig]) => {
                    if (subModuleName !== 'active' && subModuleName !== 'id') {
                        if (company.companyFeatures.modules[moduleName][subModuleName]) {
                            company.companyFeatures.modules[moduleName][subModuleName].permissions = {
                                ...company.companyFeatures.modules[moduleName][subModuleName].permissions,
                                ...subModuleConfig.permissions
                            };
                        }
                    }
                });
            }
        }
        await company.save();

        // Update specific roles if roleIds provided, otherwise update all company roles
        const roleQuery = roleIds?.length > 0 
            ? { companyId, _id: { $in: roleIds } }
            : { companyId };

        // Prepare update query for roles
        const updateQuery = {};
        for (const [moduleName, moduleConfig] of Object.entries(modules)) {
            updateQuery[`modules.${moduleName}`] = moduleConfig;
        }

        const updatedRoles = await Role.updateMany(
            roleQuery,
            { $set: updateQuery }
        );

        return res.status(200).json({
            success: true,
            message: 'Modules have been updated successfully',
            data: {
                companyFeatures: company.companyFeatures,
                rolesUpdated: updatedRoles.modifiedCount
            }
        });

    } catch (error) {
        console.error('Error in toggleModule:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update modules',
            error: error.message
        });
    }
};

export default toggleModule; 