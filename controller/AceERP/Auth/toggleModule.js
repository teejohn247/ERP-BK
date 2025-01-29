import Role from '../../../model/Roles';
import Company from '../../../model/Company';
import Employee from '../../../model/Employees';

const toggleModule = async (req, res) => {
    try {
        const { companyId, roleIds, modules } = req.body;

        if (!companyId || !Array.isArray(modules)) {
            return res.status(400).json({
                success: false,
                message: 'CompanyId and modules array are required'
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

        // Group permissions by moduleId and featureId for easier processing
        const groupedPermissions = modules.reduce((acc, permission) => {
            const { moduleId, featureId, permissionId, permissionValue } = permission;
            
            if (!acc[moduleId]) acc[moduleId] = {};
            if (!acc[moduleId][featureId]) acc[moduleId][featureId] = {};
            
            acc[moduleId][featureId][permissionId] = permissionValue;
            return acc;
        }, {});

        // Update company features
        for (const [moduleId, features] of Object.entries(groupedPermissions)) {
            if (company.companyFeatures.modules[moduleId]) {
                for (const [featureId, permissions] of Object.entries(features)) {
                    if (company.companyFeatures.modules[moduleId][featureId]) {
                        // Find the permission in the array and update its value
                        const permissionArray = company.companyFeatures.modules[moduleId][featureId].permissions;
                        for (const permissionId in permissions) {
                            const permissionIndex = permissionArray.findIndex(p => p._id.toString() === permissionId);
                            if (permissionIndex !== -1) {
                                permissionArray[permissionIndex].value = permissions[permissionId];
                            }
                        }
                    }
                }
            }
        }
        await company.save();

        // Update systemRoles in Company
        if (roleIds?.length > 0) {
            const company = await Company.findById(companyId);
            if (!company) {
                return res.status(404).json({
                    success: false,
                    message: 'Company not found'
                });
            }

            for (const role of company.systemRoles) {
                if (roleIds.includes(role._id.toString())) {
                    for (const permission of role.rolePermissions) {
                        // Only match moduleId and featureId since we want to update the permission
                        // regardless of the existing permissionId
                        const moduleUpdate = modules.find(mod => 
                            mod.moduleId === permission.moduleId &&
                            mod.featureId === permission.featureId
                        );

                        if (moduleUpdate) {
                            permission.permissionValue = moduleUpdate.permissionValue;
                        }
                    }
                }
            }

            await company.save();
        }

        // Update systemRoles in Employee documents - Modified to match by roleId
        if (roleIds?.length > 0) {
            await Employee.updateMany(
                { 
                    companyId,
                    'systemRoles._id': { $in: roleIds }
                },
                {
                    $set: {
                        'systemRoles.$[role].rolePermissions': modules
                    }
                },
                {
                    arrayFilters: [{ 'role._id': { $in: roleIds } }]
                }
            );
        }

        // Update specific roles if roleIds provided, otherwise update all company roles
        const roleQuery = roleIds?.length > 0 
            ? { companyId, _id: { $in: roleIds } }
            : { companyId };

        // Prepare update query for roles using the grouped permissions
        const updateQuery = {};
        for (const [moduleId, features] of Object.entries(groupedPermissions)) {
            for (const [featureId, permissions] of Object.entries(features)) {
                updateQuery[`modules.${moduleId}.${featureId}.permissions`] = permissions;
            }
        }

        const updatedRoles = await Role.updateMany(
            roleQuery,
            { $set: updateQuery }
        );

        return res.status(200).json({
            success: true,
            message: 'Modules and permissions have been updated successfully',
            data: {
                companyFeatures: company.companyFeatures,
                rolesUpdated: updatedRoles.modifiedCount
            }
        });

    } catch (error) {
        console.error('Error in toggleModule:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update modules and permissions',
            error: error.message
        });
    }
};

export default toggleModule; 