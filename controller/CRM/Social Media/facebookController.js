import { FB } from 'fb';

// Helper function to handle media uploads with user's token
const uploadMedia = async (mediaUrl, accessToken) => {
  try {
    const fb = new FB.Facebook();
    fb.setAccessToken(accessToken);
    
    const response = await fb.api('/me/photos', 'POST', {
      url: mediaUrl,
      published: false
    });
    return response.id;
  } catch (error) {
    console.error('Media upload failed:', error);
    throw error;
  }
};

// Main post creation controller
const createPost = async (req, res) => {
  try {
    const {
      message,
      mediaUrls = [],
      scheduleTime,
      isPublished = true,
      accessToken  // Get access token from request body
    } = req.body;

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    // Create new instance with user's token
    const fb = new FB.Facebook();
    fb.setAccessToken(accessToken);

    const postData = {
      message,
      published: isPublished
    };

    // Handle scheduling
    if (scheduleTime) {
      postData.scheduled_publish_time = Math.floor(new Date(scheduleTime).getTime() / 1000);
      postData.published = false;
    }

    // Handle media attachments
    if (mediaUrls.length > 0) {
      // For images
      if (mediaUrls[0].endsWith('.jpg') || mediaUrls[0].endsWith('.png')) {
        const photoIds = await Promise.all(
          mediaUrls.map(url => uploadMedia(url, accessToken))
        );
        postData.attached_media = photoIds.map(id => ({ media_fbid: id }));
      } 
      // For videos
      else if (mediaUrls[0].endsWith('.mp4')) {
        postData.file_url = mediaUrls[0];
      }
    }

    // Create the post using user's FB instance
    const response = await fb.api('/me/feed', 'POST', postData);

    return res.status(200).json({
      success: true,
      postId: response.id,
      message: 'Post created successfully'
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create post'
    });
  }
};

export default createPost; 