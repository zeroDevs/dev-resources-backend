const mongoose = require('mongoose');

const userTokenSchema = new mongoose.Schema({
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
    accessToken: {
        type: String,
        required: "accessToken required"
    },
    refreshToken: {
        type: String,
        required: "refreshToken required"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('userTokens', userTokenSchema);
