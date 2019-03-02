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
  downvotes: [
    {
      type: String
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

ResourceSchema.path('slug').set(function(value) {
  const slug =
    this.meta.title
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s\s+/g, ' ')
      .replace(/\s+/g, '-')
      .toLowerCase() +
    '-' +
    this._id.toString().slice(0, 5);
  console.log('this is the slug' + slug);
  return slug;
});

module.exports = mongoose.model('Resource', ResourceSchema);
