import Subscription from '../../../model/Subscriptions';
import Company from '../../../model/Company';
import dotenv from 'dotenv';

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

        // Validate modules
        if (!modules || !Array.isArray(modules) || modules.length === 0) {
            return res.status(400).json({
                status: 400,
                success: false,
                errorMessage: 'At least one module is required'
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

        // Update company features based on subscribed modules
        const companyFeatures = company.companyFeatures[0] || {};
        
        // Update subscription status
        companyFeatures.subscriptionStatus = {
            isActive: true,
            plan: status,
            startDate: startDate || new Date(),
            endDate: endDate || null,
            autoRenew: false
        };

        // Update modules
        if (modules.includes('hr')) {
            companyFeatures.modules = {
                ...companyFeatures.modules,
                hr: {
                    ...companyFeatures.modules?.hr,
                    type: Boolean,
                    default: true,
                    features: {
                        employeeManagement: true,
                        leaveManagement: true,
                        designationManagement: true,
                        departmentManagement: true,
                        appraisalManagement: true,
                        expenseManagement: true
                    }
                }
            };
        }
        if (modules.includes('orderManagement')) {
            companyFeatures.modules = {
                ...companyFeatures.modules,
                orderManagement: {
                    ...companyFeatures.modules?.orderManagement,
                    type: Boolean,
                    default: true,
                    features: {
                        orderProcessing: true,
                        inventoryManagement: true,
                        invoicing: true,
                        shipping: true
                    }
                }
            };
        }

        // Update company with new features
        await Company.findByIdAndUpdate(companyId, {
            $set: { companyFeatures: [companyFeatures] }
        }, { 
            new: true,
            upsert: true 
        });

        // Create new subscription with company details
        const newSubscription = await Subscription.create({
            status,
            price,
            subscriptionCycle,
            modules,
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
