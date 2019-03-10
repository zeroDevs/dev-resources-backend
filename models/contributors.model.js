const mongoose = require('mongoose');

const ContributorSchema = new mongoose.Schema({
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
    url: {
        type: String,
        default: ""
    },
    frontend: {
        type: Object,
    },
    backend: {
        type: Object
    }
});

module.exports = mongoose.model('Contributors', ContributorSchema);
