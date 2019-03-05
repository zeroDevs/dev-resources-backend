const Response = require('../utils/classes/Response');
const validator = require('../validations/user.validation');
const User = require('../models/user.model');

const UserHandler = {};

UserHandler.create = ({ id, username, avatar, discriminator }) => {
    return new Promise((resolve, reject) => {
        const response = new Response();
        validator({ id, username, avatar, discriminator })
            .then(() => {
                const user = new User({ id, username, avatar, discriminator })
                user.save(error => {
                    if (error) {
                        response.setMessage(error.message);
                        response.setPayload({ id });
                        reject(response);
                    } else {
                        response.setSuccess();
                        response.setMessage('Successfully added into the database');
                        response.setPayload({
                            id,
                            username,
                            avatar,
                            discriminator
                        });
                        resolve(response);
                    }
                });
            })
            .catch(error => {
                response.setMessage(error.message);
                response.setPayload({ id, username, avatar, discriminator });
                reject(response);
            });
    })
    .catch(error => console.error(error));

}

UserHandler.addBookmark = ({ userId, resourceSlug }) => {
    return new Promise((resolve, reject) => {
        const response = new Response();
        User.findOneAndUpdate(
            {
                id: userId
            },
            {
                $addToSet: {
                    bookmarks: resourceSlug
                }
            },
            {
                new: true
            }).exec()
            .then((user) => {
                response.setSuccess();
                response.setMessage('Successfully bookmarked');
                response.setPayload({
                    bookmark: user.bookmarks.length
                })
                resolve(response);
            })
            .catch(error => reject(response))
    });
};

UserHandler.retrieveBookmarks = (userId) => {
    return new Promise((resolve, reject) => {
        const response = new Response();
        const userObj = User.findOne({ id: userId }).exec()
        userObj.then((user) => {
            if (user.bookmarks) {
                response.setSuccess();
                response.setMessage("Bookmarks found");
                response.setPayload({
                    bookmarks: user.bookmarks
                });
                resolve(response);
            }
            else {
                response.setPayload({ bookmarks: "not found" })
                reject(response);
            }
        })
    })
    .catch(error => console.error(error));

};

UserHandler.addGuild = ({ userId, guilds }) => {
    return new Promise((resolve, reject) => {
        const response = new Response();
        User.findOneAndUpdate(
            {
                id: userId
            },
            {
                $addToSet: {
                    guilds: guilds
                }
            },
            {
                new: true
            }).exec()
            .then((user) => {
                response.setSuccess();
                response.setMessage('Successfully bookmarked');
                response.setPayload({
                    guilds: user.guilds.length
                })
                resolve(response);
            })
            .catch(error => reject(response))
    });
};

UserHandler.retrieveUser = (userId) => {
    return new Promise((resolve, reject) => {
        const response = new Response();
        const userObj = User.findOne({ id: userId }).exec()
        userObj.then((user) => {
            if (user) {
                response.setSuccess();
                response.setMessage("User found");
                response.setPayload({
                    id: user.id,
                    username: user.username,
                    avatar: user.avatar,
                    discriminator: user.discriminator,
                    guilds: user.guilds
                });
                resolve(response);
            }
            else {
                response.setPayload({ user: "not found" })
                reject(response);
            }
        })
    })
    .catch(error => console.error(error));

};

module.exports = UserHandler;
