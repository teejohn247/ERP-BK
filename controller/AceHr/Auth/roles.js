import Modules from '../../../model/Modules.js';
import Company from '../../../model/Company.js';
import Role from '../../../model/Roles.js';

const role = async (req, res) => {
    try {
        const { roleName, companyId, modules, description } = req.body;
        // modules is now an array of module IDs

        // Validate required fields
        if (!roleName || !companyId || !Array.isArray(modules)) {
            return res.status(400).json({
                success: false,
                error: 'Please provide roleName, companyId, and modules array'
            });
        }

        // Get company details
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                success: false,
                error: 'Company not found'
            });
        }

        // Fetch existing modules document
        const moduleDoc = await Modules.findOne();
        if (!moduleDoc) {
            return res.status(404).json({
                success: false,
                error: 'No modules configuration found'
            });
        }

        // Initialize role permissions structure
        const roleModules = {};

        // Create a map of module IDs to module names
        const moduleMapping = {};
        for (const [moduleName, moduleData] of Object.entries(moduleDoc.modules)) {
            moduleMapping[moduleData.id] = moduleName;
        }

        // For each module ID in the payload
        for (const moduleId of modules) {
            const moduleName = moduleMapping[moduleId];
            
            if (!moduleName) {
                return res.status(400).json({
                    success: false,
                    error: `Invalid module ID: ${moduleId}`
                });
            }

            if (moduleDoc.modules[moduleName]) {
                // Add module regardless of permissions
                roleModules[moduleName] = {
                    id: moduleId,
                };

                // Copy each feature and its permissions
                for (const [featureName, featureData] of Object.entries(moduleDoc.modules[moduleName])) {
                    if (featureName === 'id') continue;
                    
                    // Initialize feature with empty permissions if none exist
                    let processedPermissions = {};
                    
                    // Process permissions if they exist
                    if (featureData.permissions) {
                        if (featureData.permissions instanceof Map) {
                            processedPermissions = new Map();
                            for (const [key, value] of featureData.permissions) {
                                processedPermissions.set(key, Boolean(value === true || value === 'true'));
                            }
                        } else {
                            for (const [key, value] of Object.entries(featureData.permissions)) {
                                processedPermissions[key] = Boolean(value === true || value === 'true');
                            }
                        }
                    }

                    roleModules[moduleName][featureName] = {
                        id: featureData.id,
                        permissions: processedPermissions
                    };
                }
            }
        }

        // Check if role name already exists for this company
        const existingRole = await Role.findOne({ 
            companyId: companyId,
            roleName: roleName 
        });
        
        if (existingRole) {
            return res.status(400).json({
                success: false,
                error: 'Role name already exists for this company'
            });
        }

        // Create new role
        const newRole = new Role({
            companyId: companyId,
            companyName: company.companyName,
            roleName,
            description: description || '',
            // modules: roleModules
        });

        const savedRole = await newRole.save();

        res.status(201).json({
            success: true,
            data: savedRole,
            message: 'Role created successfully'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

export default role;
