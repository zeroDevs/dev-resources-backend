const Response = require('../utils/classes/Response');
const validator = require('../validations/user.validation');
const User = require('../models/user.model');

const UserHandler = {};

UserHandler.create = ({ id, username, avatar }) => {
    return new Promise((resolve, reject) => {
        const response = new Response();
        validator({ id, username, avatar })
            .then(() => {
                const user = new User({ id, username, avatar })
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
                            avatar
                        });
                        resolve(response);
                    }
                });
            })
            .catch(error => {
                response.setMessage(error.message);
                response.setPayload({ id, username, avatar });
                reject(response);
            });
    })

}

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
                response.setMessage("error");
                response.setPayload({ bookmarks: "not found" })
                reject(response);
            }
        })
    })

}

module.exports = UserHandler;