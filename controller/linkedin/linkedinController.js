import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const getLinkedInAccessToken = async (req, res) => {
    try {
        const { code } = req.body;
        
        const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
            params: {
                grant_type: 'authorization_code',
                code,
                client_id: process.env.LINKEDIN_CLIENT_ID,
                client_secret: process.env.LINKEDIN_CLIENT_SECRET,
                redirect_uri: process.env.LINKEDIN_CALLBACK_URL
            }
        });

        return res.status(200).json({
            status: 200,
            success: true,
            data: {
                accessToken: tokenResponse.data.access_token
            }
        });

    } catch (error) {
        console.error('LinkedIn Token Error:', error.response?.data || error.message);
        return res.status(500).json({
            status: 500,
            success: false,
            error: 'Failed to get access token'
        });
    }
};

const createLinkedInPost = async (req, res) => {
    try {
        const { content, accessToken } = req.body;

        // First get user profile to get URN
        const profileResponse = await axios.get('https://api.linkedin.com/v2/me', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            }
        });

        const userUrn = profileResponse.data.id;

        // Create the post
        const postResponse = await axios.post(
            'https://api.linkedin.com/v2/ugcPosts',
            {
                author: `urn:li:person:${userUrn}`,
                lifecycleState: 'PUBLISHED',
                specificContent: {
                    'com.linkedin.ugc.ShareContent': {
                        shareCommentary: {
                            text: content
                        },
                        shareMediaCategory: 'NONE'
                    }
                },
                visibility: {
                    'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                }
            }
        );

        return res.status(200).json({
            status: 200,
            success: true,
            data: postResponse.data
        });

    } catch (error) {
        console.error('LinkedIn Post Error:', error.response?.data || error.message);
        return res.status(500).json({
            status: 500,
            success: false,
            error: 'Failed to create LinkedIn post'
        });
    }
};

const getLinkedInAuthUrl = async (req, res) => {
    try {
        const scope = 'w_member_social r_liteprofile r_emailaddress';
        const state = Math.random().toString(36).substring(7); // Generate random state

        const authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
            `response_type=code&` +
            `client_id=${process.env.LINKEDIN_CLIENT_ID}&` +
            `redirect_uri=${encodeURIComponent(process.env.LINKEDIN_CALLBACK_URL)}&` +
            `state=${state}&` +
            `scope=${encodeURIComponent(scope)}`;

        return res.status(200).json({
            status: 200,
            success: true,
            data: {
                authUrl,
                state
            }
        });
    } catch (error) {
        console.error('LinkedIn Auth URL Error:', error.message);
        return res.status(500).json({
            status: 500,
            success: false,
            error: 'Failed to generate LinkedIn authorization URL'
        });
    }
};

export { getLinkedInAuthUrl, getLinkedInAccessToken, createLinkedInPost }; 