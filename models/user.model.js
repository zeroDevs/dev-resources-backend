const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    id: {
        type: String,
        required: 'User ID is required'
    },
    username: {
        type: String,
        required: 'Username is required'
    },
    avatar: {
        type: String,
        default: ""
    },
    bookmarks: {
        type: Array,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);
