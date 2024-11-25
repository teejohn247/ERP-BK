const express = require('express');
const router = express.Router();
const { FB } = require('fb');
const config = require('../../config');

// Initialize Facebook SDK
FB.setAccessToken(config.facebook.accessToken);

// Helper function to handle media uploads
async function uploadMedia(mediaUrl) {
  try {
    const response = await FB.api('/me/photos', 'POST', {
      url: mediaUrl,
      published: false
    });
    return response.id;
  } catch (error) {
    console.error('Media upload failed:', error);
    throw error;
  }
}

// Main posting endpoint
router.post('/create', async (req, res) => {
  try {
    const {
      message,
      mediaUrls = [],
      scheduleTime,
      isPublished = true
    } = req.body;

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
        const photoIds = await Promise.all(mediaUrls.map(uploadMedia));
        postData.attached_media = photoIds.map(id => ({ media_fbid: id }));
      } 
      // For videos
      else if (mediaUrls[0].endsWith('.mp4')) {
        postData.file_url = mediaUrls[0];
      }
    }

    // Create the post
    const response = await FB.api('/me/feed', 'POST', postData);

    res.status(200).json({
      success: true,
      postId: response.id,
      message: 'Post created successfully'
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create post'
    });
  }
});

module.exports = router; 