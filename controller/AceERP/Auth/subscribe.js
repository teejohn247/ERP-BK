import Subscription from '../../../model/Subscriptions';
import Company from '../../../model/Company';
import dotenv from 'dotenv';
import Module from '../../../model/Modules';
import mongoose from 'mongoose';
import SubscriptionPlan from '../../../model/SubscriptionPlan';

dotenv.config();

const subscribe = async (req, res) => {
    try {
        const { 
            subscriptionPlanId,
            subscriptionCycle,
            companyId,
            userRange
        } = req.body;

        // Validate required fields and company
        let company = await Company.findOne({ _id: companyId });
        if (!company) {
            return res.status(404).json({
                status: 404,
                success: false,
                errorMessage: 'Company not found'
            });
        }

        // Check for active or pending subscriptions
        const latestSubscription = await Subscription.findOne({
            companyId,
            status: { $in: ['active', 'pending'] }
        }).sort({ endDate: -1 });  // Get the subscription with the latest end date

        // Fetch subscription plan
        const subscriptionPlan = await SubscriptionPlan.findById(subscriptionPlanId);
        if (!subscriptionPlan) {
            return res.status(404).json({
                status: 404,
                success: false,
                errorMessage: 'Subscription plan not found'
            });
        }

        // Check Free Trial eligibility
        if (subscriptionPlan.subscriptionName === 'Free-Trial') {
            // Get all free trial subscriptions for this company
            const freeTrialSubscriptions = await Subscription.find({
                companyId,
                subscriptionPlan: 'Free-Trial'
            });

            // Check if any free trial is 2 months or older
            const twoMonthsAgo = new Date();
            twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

            const hasExpiredFreeTrial = freeTrialSubscriptions.some(sub => {
                return new Date(sub.startDate) <= twoMonthsAgo;
            });


            if (hasExpiredFreeTrial || company.freeTrialExpired) {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    errorMessage: 'Free trial period has expired. Please choose a different subscription plan.'
                });
            }
        }

        // Calculate subscription dates
        const startDate = latestSubscription 
            ? new Date(latestSubscription.endDate) // Start after latest subscription ends
            : new Date();
        const endDate = new Date(startDate);
        
        switch (subscriptionCycle) {
            case 'biweekly':
                endDate.setDate(endDate.getDate() + 14);
                break;
            case 'monthly':
                endDate.setMonth(endDate.getMonth() + 1);
                break;
            case 'annually':
                endDate.setFullYear(endDate.getFullYear() + 1);
                break;
        }

        // Create new subscription with appropriate status
        const newSubscription = await Subscription.create({
            subscriptionPlan: subscriptionPlan.subscriptionName,
            unitPrice: subscriptionPlan.unitPrice,
            subscriptionCycle,
            modules: subscriptionPlan.modules,
            companyId,
            companyName: company.name,
            email: company.email,
            startDate,
            endDate,
            userRange,
            status: latestSubscription ? 'pending' : 'active'
        });

        // Update company features and free trial status if needed
        if (!latestSubscription) {
            const updateData = {
                'companyFeatures.modules': subscriptionPlan.modules,
                'companyFeatures.subscriptionStatus': {
                    isActive: true,
                    plan: subscriptionPlan.subscriptionName,
                    currentCycle: subscriptionCycle,
                    startDate,
                    endDate
                }
            };

            // If this is a free trial subscription, we'll update the status after 2 months
            if (subscriptionPlan.subscriptionName === 'Free-Trial') {
                // Instead of setTimeout, directly store the expiration date
                const twoMonthsFromNow = new Date();
                twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);

                console.log(twoMonthsFromNow);
                
                updateData.freeTrialExpirationDate = twoMonthsFromNow;
            }

            await Company.findByIdAndUpdate(companyId, updateData);
        }

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