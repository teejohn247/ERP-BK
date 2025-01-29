const Post = require('../../../model/Post');

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { mediaAccounts, scheduledDate, scheduledTime, image, caption } = req.body;
    
    const post = new Post({
      mediaAccounts,
      scheduledDate,
      scheduledTime,
      image,
      caption
    });

    const savedPost = await post.save();
    res.status(201).json({ success: true, data: savedPost });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ scheduledDate: -1 });
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single post
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update post
exports.updatePost = async (req, res) => {
  try {
    // Add debugging logs

    const { mediaAccounts, scheduledDate, scheduledTime, image, caption } = req.body;
    
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        mediaAccounts,
        scheduledDate,
        scheduledTime,
        image,
        caption
      },
      { new: true }
    );
    res.status(200).json({ success: true, data: updatedPost });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    await post.remove();
    res.status(200).json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};