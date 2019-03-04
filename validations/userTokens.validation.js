const ValidationError = require('../utils/classes/ValidationError');

module.exports = userTokens => {
    return new Promise((resolve, reject) => {
        if (!userTokens || typeof userTokens !== 'object') {
            reject(new ValidationError('Please enter a valid user object'));
        }

        if (!userTokens.id || typeof userTokens.id !== 'string') {
            reject(new ValidationError('Wrong user ID'));
        }

        if (!userTokens.username || typeof userTokens.username !== 'string') {
            reject(new ValidationError('Username not valid'));
        }

        if (!userTokens.accessToken || typeof userTokens.accessToken !== 'string') {
            reject(new ValidationError('Access token is not valid'));
        }

        if (!userTokens.refreshToken || typeof userTokens.refreshToken !== 'string') {
            reject(new ValidationError('Refresh token is not valid'));
        }

        resolve(true);
    })
    .catch(error => console.error(error));
};
