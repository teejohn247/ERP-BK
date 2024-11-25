import Module from '../../../model/Modules.js';
import Company from '../../../model/Company.js';
import Role from '../../../model/Roles.js';


const fetchAdminRoles = async (req, res) => {
    try {
        // Check for module updates
        const modules = await Module.find({});
        const roles = await Role.find({});

        // Check each role's permissions against current module schema
        const updatedRoles = await Promise.all(roles.map(async (role) => {
            let hasUpdates = false;
            const updatedPermissions = { ...role.permissions };

            // Compare and update permissions for each module
            modules.forEach((module) => {
                // Initialize module if it doesn't exist
                if (!updatedPermissions[module.name]) {
                    updatedPermissions[module.name] = {};
                    hasUpdates = true;
                }

                // Check for new permissions in existing modules
                const modulePermissions = module.permissions || {};
                Object.keys(modulePermissions).forEach((permission) => {
                    // Add any new permissions that don't exist
                    if (updatedPermissions[module.name][permission] === undefined) {
                        console.log(`Adding new permission: ${permission} to module: ${module.name}`);
                        updatedPermissions[module.name][permission] = false;
                        hasUpdates = true;
                    }
                });

                // Optional: Remove any permissions that no longer exist in the module schema
                Object.keys(updatedPermissions[module.name]).forEach((permission) => {
                    if (!modulePermissions.hasOwnProperty(permission)) {
                        delete updatedPermissions[module.name][permission];
                        hasUpdates = true;
                    }
                });
            });

            // Update role if changes were detected
            if (hasUpdates) {
                return await Role.findByIdAndUpdate(
                    role._id,
                    { permissions: updatedPermissions },
                    { new: true }
                );
            }
            return role;
        }));

        return res.status(200).json({
            success: true,
            data: updatedRoles
        });

    } catch (error) {
        console.error('Error in fetchRoles:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch roles',
            error: error.message
        });
    }
};

module.exports = fetchAdminRoles;
