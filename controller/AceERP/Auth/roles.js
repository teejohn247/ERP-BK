import Modules from '../../../model/Modules.js';
import Company from '../../../model/Company.js';
import Role from '../../../model/Roles.js';

// Helper function for default permissions
async function getDefaultPermissions(roleName) {
    const moduleDoc = await Modules.findOne();
    if (!moduleDoc) return [];

    const rolePermissions = [];
    
    // Process all modules for default roles
    for (const moduleData of moduleDoc.modules) {
        for (const feature of moduleData.moduleFeatures) {
            if (feature.featurePermissions && feature.featurePermissions.length > 0) {
                for (const permission of feature.featurePermissions) {
                    rolePermissions.push({
                        moduleId: moduleData._id,
                        featureId: feature._id,
                        permissionKey: permission.key,
                        permissionValue: roleName === 'Super Admin' // Only Super Admin gets all permissions by default
                    });
                }
            }
        }
    }
    
    return rolePermissions;
}

// Helper function to process module permissions for custom roles
async function processModulePermissions(modules) {
    const rolePermissions = [];
    const moduleDoc = await Modules.findOne();
    
    if (!moduleDoc) {
        throw new Error('No modules configuration found');
    }

    for (const moduleId of modules) {
        const moduleData = moduleDoc.modules.find(
            module => module._id.toString() === moduleId
        );
        
        if (!moduleData) {
            throw new Error(`Invalid module ID: ${moduleId}`);
        }

        for (const feature of moduleData.moduleFeatures) {
            if (feature.featurePermissions && feature.featurePermissions.length > 0) {
                for (const permission of feature.featurePermissions) {
                    rolePermissions.push({
                        moduleId: moduleId,
                        featureId: feature._id,
                        permissionType: permission.permissionType,
                        permissionKey: permission.key,
                        permissionValue: false
                    });
                }
            }
        }
    }

    return rolePermissions;
}

const role = async (req, res) => {
    try {
        // First create default roles if they don't exist
        const defaultRoles = ['Super Admin', 'Manager', 'Staff', 'External'];
        
        // Create default roles for each company one at a time
        for (const defaultRole of defaultRoles) {
            const companies = await Company.find({
                'systemRoles.roleName': { $ne: defaultRole }
            });

            for (const company of companies) {
                const defaultRolePermissions = await getDefaultPermissions(defaultRole);
                const newDefaultRole = new Role({
                    roleName: defaultRole,
                    description: `Default ${defaultRole} role`,
                    rolePermissions: defaultRolePermissions,
                    companyId: company._id
                });
                
                const savedDefaultRole = await newDefaultRole.save();
                
                await Company.findByIdAndUpdate(
                    company._id,
                    {
                        $push: {
                            systemRoles: {
                                _id: savedDefaultRole._id,
                                roleName: savedDefaultRole.roleName,
                                description: savedDefaultRole.description,
                                rolePermissions: savedDefaultRole.rolePermissions
                            }
                        }
                    }
                );
            }
        }

        // Now handle the new role creation
        const { roleName, modules, description } = req.body;

        // Validate required fields
        if (!roleName || !Array.isArray(modules)) {
            return res.status(400).json({
                status: 400,
                error: 'Please provide roleName and modules array'
            });
        }

        // Check if role name already exists in ANY company's systemRoles
        const roleExistsInAnyCompany = await Company.findOne({
            'systemRoles.roleName': roleName
        });

        if (roleExistsInAnyCompany) {
            return res.status(400).json({
                status: 400,
                error: 'Role name already exists'
            });
        }

        // Get all companies after default roles are created
        const updatedCompanies = await Company.find({});
        const savedRoles = [];

        // Create the new role for each company
        for (const company of updatedCompanies) {
            const rolePermissions = await processModulePermissions(modules);
            
            const newRole = new Role({
                roleName,
                description: description || '',
                rolePermissions,
                companyId: company._id
            });

            const savedRole = await newRole.save();
            savedRoles.push(savedRole);

            await Company.findByIdAndUpdate(
                company._id,
                {
                    $push: {
                        systemRoles: {
                            _id: savedRole._id,
                            roleName: savedRole.roleName,
                            description: savedRole.description,
                            rolePermissions: savedRole.rolePermissions
                        }
                    }
                }
            );
        }

        res.status(200).json({
            status: 200,
            data: savedRoles,
            message: 'Roles created successfully for all companies'
        });

    } catch (error) {
        console.error('Error creating roles:', error);
        res.status(500).json({
            status: 500,
            error: error.message
        });
    }
};

export default role;
