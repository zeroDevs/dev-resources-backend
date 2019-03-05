const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    id: {
        type: String,
        required: 'User ID is required',
        unique: "user already exist"
    },
    username: {
        type: String,
        required: 'Username is required',
        unique: "user already exist"
    },
    avatar: {
        type: String,
        default: ""
    },
    discriminator: {
        type: String,
        default: ""
    },
    bookmarks: {
        type: Array,
    },
    guilds: {
        type: Array
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);
