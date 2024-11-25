import Subscription from '../../../model/Subscriptions';
import Company from '../../../model/Company';
import dotenv from 'dotenv';
import Module from '../../../model/Modules';
import mongoose from 'mongoose';

dotenv.config();

const subscribe = async (req, res) => {
    try {
        const { 
            status = 'free',
            price,
            subscriptionCycle,
            modules,
            companyId,
            startDate,
            endDate
        } = req.body;

        // Validate modules array contains valid IDs
        if (!modules || !Array.isArray(modules) || modules.length === 0) {
            return res.status(400).json({
                status: 400,
                success: false,
                errorMessage: 'At least one module ID is required'
            });
        }
        // Validate paid subscription details
        if (status === 'paid') {
            if (!price || !subscriptionCycle || !endDate) {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    errorMessage: 'Price, subscription cycle, and end date are required for paid subscriptions'
                });
            }

            if (!['monthly', 'annually'].includes(subscriptionCycle)) {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    errorMessage: 'Subscription cycle must be either monthly or annually'
                });
            }
        }

        // Add company lookup
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                status: 404,
                success: false,
                errorMessage: 'Company not found'
            });
        }

        // Update company features based on module IDs
        const companyFeatures = company.companyFeatures[0] || {};
        
        // Update subscription status
        companyFeatures.subscriptionStatus = {
            isActive: true,
            plan: status,
            startDate: startDate || new Date(),
            currentCycle: subscriptionCycle,
            endDate: endDate || null,
            autoRenew: false
        };

        // Initialize modules object if it doesn't exist
        companyFeatures.modules = companyFeatures.modules || {};

        // Validate that modules are valid ObjectIds
        const validModuleIds = modules.map(id => {
            try {
                return mongoose.Types.ObjectId(id);
            } catch (error) {
                return null;
            }
        }).filter(id => id !== null);

        if (validModuleIds.length !== modules.length) {
            return res.status(400).json({
                status: 400,
                success: false,
                errorMessage: 'One or more invalid module IDs provided. Please use valid ObjectIds'
            });
        }

        // Fetch all modules first
        const moduleData = await Module.findOne();
        if (!moduleData) {
            return res.status(404).json({
                status: 404,
                success: false,
                errorMessage: 'Module configuration not found'
            });
        }

        // Validate and collect module details based on numeric IDs
        const detailedModules = modules.map(moduleId => {
            // Search through the modules structure for matching ID
            for (const [moduleName, moduleInfo] of Object.entries(moduleData.modules)) {
                if (moduleInfo.id === parseInt(moduleId)) {
                    // Just return the module name as a string
                    return moduleName;
                }
            }
            return null;
        }).filter(module => module !== null);

        if (detailedModules.length !== modules.length) {
            return res.status(400).json({
                status: 400,
                success: false,
                errorMessage: 'One or more invalid module IDs provided'
            });
        }

        // Create new subscription with just module names
        const newSubscription = await Subscription.create({
            status,
            price,
            subscriptionCycle,
            modules: detailedModules, // Now just an array of strings like ['HumanResources', 'OrderManagement']
            companyId,
            companyName: company.name,
            email: company.email,
            endDate,
            startDate
        });

        return res.status(201).json({
            status: 201,
            success: true,
            data: newSubscription
        });

    } catch (error) {
        console.error('Subscription error:', error);
        return res.status(500).json({
            status: 500,
            success: false,
            error: error.message
        });
    }
};

export default subscribe;
