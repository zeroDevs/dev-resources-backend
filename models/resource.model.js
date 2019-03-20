const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  meta: {
    title: String,
    image: String,
    description: String
  },
  link: {
    type: String,
    trim: true,
    required: 'Link is required',
    unique: 'Link exists already'
  },
  slug: {
    type: String,
    required: 'Slug is required',
    unique: 'Slug exists already'
  },
  author: {
    id: {
      type: String,
      required: 'User ID is required'
    },
    username: {
      type: String,
      required: 'Username is required'
    },
    discriminator: {
      type: String,
      required: 'Discriminator is required'
    },
    avatar: String
  },
  upvotes: [
    {
      type: String
    }
  ],
  tags: [
    {
      type: String
    }
  ],
  downvotes: [
    {
      type: String
    }
  ],
  comments: [
    {
      username: {
        type: string,
        required: "username is required"
      },
      comment: {
        type: string,
        required: "comment is required" 
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('Resource', ResourceSchema);
