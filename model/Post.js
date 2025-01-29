const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  mediaAccounts: {
    type: [String],
    required: true
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  scheduledTime: {
    type: String,
    required: true
  },
  image: {
    type: String,  // Store image URL or path
    default: null
  },
  caption: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Post', PostSchema);