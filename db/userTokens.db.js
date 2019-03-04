const Response = require('../utils/classes/Response');
const validator = require('../validations/userTokens.validation');
const userTokens = require('../models/userTokens.model');

const UserTokensHandler = {};

UserTokensHandler.create = ({ id, username, accessToken, refreshToken }) => {
    return new Promise((resolve, reject) => {
        const response = new Response();
        validator({ id, username, accessToken, refreshToken })
            .then(() => {
                const user_tokens = new userTokens({ id, username, accessToken, refreshToken })
                user_tokens.save(error => {
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
                            accessToken,
                            refreshToken
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
    .catch(error => console.error(error));

}

UserTokensHandler.findUser = (userId) => {
    return new Promise((resolve, reject) => {
        const response = new Response();
        const userObj = userTokens.findOne({ id: userId }).exec()
        userObj.then((user) => {
            console.log(user);
            if (user.accessToken) {
                response.setSuccess();
                response.setMessage("user found");
                response.setPayload({
                    accessToken: user.accessToken
                });
                resolve(response);
            } else {
                response.setMessage("error");
                response.setPayload({ user: "not found" })
                reject(response);
            }
        })
    })
    .catch(error => console.error(error));

}

module.exports = UserTokensHandler;
