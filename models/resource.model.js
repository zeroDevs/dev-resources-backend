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
  }
});

module.exports = mongoose.model('Resource', ResourceSchema);
