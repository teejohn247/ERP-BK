import Subscription from '../../../model/Subscriptions';

const fetchSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find()
          

        if (!subscriptions || subscriptions.length === 0) {
            return res.status(404).json({
                status: 404,
                message: 'No subscriptions found'
            });
        }

        res.status(200).json({
            status: 200,
            data: subscriptions
        });

    } catch (error) {
        console.error('Error in fetchSubscriptions:', error);
        res.status(500).json({
            status: 500,
            message: 'Error fetching subscriptions',
            error: error.message
        });
    }
};

export default fetchSubscriptions; 