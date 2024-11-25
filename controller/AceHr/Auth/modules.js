import Modules from '../../../model/Modules';
import Company from '../../../model/Company';

const addPermission = async (req, res) => {
    try {
        const { moduleId, featureId, permissionName, permissionValue } = req.body;

        // Get all companies
        const companies = await Company.find({});

        // Find or create module document
        let moduleDoc = await Modules.findOne() || new Modules({
            modules: {
                HumanResources: {
                    id: 1,
                    employeeManagement: { id: 101, permissions: new Map() },
                    leaveManagement: { id: 102, permissions: new Map() },
                    appraisalManagement: { id: 103, permissions: new Map() },
                    expenseManagement: { id: 104, permissions: new Map() },
                    payrollManagement: { id: 105, permissions: new Map() },
                    settingsManagement: { id: 106, permissions: new Map() },
                    calenderManagement: { id: 107, permissions: new Map() },
                },
                OrderManagement: {
                    id: 2,
                    orderProcessing: { id: 201, permissions: new Map() },
                    invoicing: { id: 202, permissions: new Map() },
                    shipping: { id: 203, permissions: new Map() }
                }
            }
        });

        // Find module and feature names from IDs
        let moduleName, featureName;
        for (const [mName, mValue] of Object.entries(moduleDoc.modules)) {
            if (mValue.id === moduleId) {
                moduleName = mName;
                for (const [fName, fValue] of Object.entries(mValue)) {
                    if (fValue.id === featureId) {
                        featureName = fName;
                        break;
                    }
                }
                break;
            }
        }

        if (!moduleName || !featureName) {
            return res.status(400).json({
                success: false,
                error: 'Invalid module or feature ID'
            });
        }

        // Update all companies with the new permission
        const updatePromises = companies.map(async (company) => {
            // Initialize companyFeatures if it doesn't exist
            if (!company.companyFeatures) {
                company.companyFeatures = {
                    modules: {}
                };
            }

            // Initialize modules if it doesn't exist
            if (!company.companyFeatures.modules) {
                company.companyFeatures.modules = {};
            }

            // Initialize the module if it doesn't exist
            if (!company.companyFeatures.modules[moduleName]) {
                company.companyFeatures.modules[moduleName] = {
                    id: moduleId
                };
            }

            // Check if feature exists and has permissions before checking permission existence
            const existingFeature = company.companyFeatures.modules[moduleName][featureName];
            if (existingFeature?.permissions) {
                const permissions = existingFeature.permissions;
                const permissionsMap = permissions instanceof Map ? permissions : new Map(Object.entries(permissions));
                if (permissionsMap.has(permissionName)) {
                    return null;  // Skip this company
                }
            }

            // Initialize the feature with permissions
            if (!company.companyFeatures.modules[moduleName][featureName]) {
                const moduleFeature = moduleDoc.modules[moduleName]?.[featureName];
                const existingPermissions = moduleFeature?.permissions || new Map();
                
                const allPermissions = new Map([
                    ...(existingPermissions instanceof Map ? existingPermissions.entries() : []),
                    [permissionName, false]
                ]);

                company.companyFeatures.modules[moduleName][featureName] = {
                    id: featureId,
                    permissions: allPermissions
                };
            } else {
                let companyFeaturePermissions = company.companyFeatures.modules[moduleName][featureName].permissions;
                
                // Convert to Map if it's not already
                if (!(companyFeaturePermissions instanceof Map)) {
                    companyFeaturePermissions = new Map(Object.entries(companyFeaturePermissions));
                }
                
                company.companyFeatures.modules[moduleName][featureName].permissions = companyFeaturePermissions;
                companyFeaturePermissions.set(permissionName, false);
            }

            return company.save();
        });

        // Filter out null values (skipped companies) before waiting for promises
        await Promise.all(updatePromises.filter(p => p !== null));

        // Continue with the module updates as before
        if (!moduleDoc.modules[moduleName]) {
            moduleDoc.modules[moduleName] = {
                id: moduleId
            };
        }

        if (!moduleDoc.modules[moduleName][featureName]) {
            moduleDoc.modules[moduleName][featureName] = {
                id: featureId,
                permissions: new Map()
            };
        }

        moduleDoc.modules[moduleName][featureName].permissions.set(permissionName, permissionValue);
        const savedModule = await moduleDoc.save();

        res.status(200).json({
            success: true,
            data: savedModule
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
}

export default addPermission;