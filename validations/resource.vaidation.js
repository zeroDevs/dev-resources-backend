const urlMetadata = require('url-metadata');
const ValidationError = require('./ValidationError');

module.exports = payload => {
  return new Promise((resolve, reject) => {
    if (!payload.link) {
      reject(new ValidationError('Link is required'));
    }

    const urlPattern = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;

    if (!urlPattern.test(payload.link)) {
      rejct(new ValidationError('Please enter a valid URL'));
    }

    if (!payload.author || typeof payload.author !== 'object') {
      reject(new ValidationError('Please enter a valid author object'));
    }

    if (!payload.author.id || typeof payload.author.id !== 'string') {
      reject(new ValidationError('Please enter a valid User ID'));
    }

    if (
      !payload.author.username ||
      typeof payload.author.username !== 'string'
    ) {
      reject(new ValidationError('Please enter a valid Username'));
    }

    if (
      !payload.author.discriminator ||
      typeof payload.author.discriminator !== 'string'
    ) {
      reject(new ValidationError('Please enter a valid discriminator'));
    }

    urlMetadata(payload.link)
      .then(() => {
        resolve(true);
      })
      .catch(error => {
        if ((error.Error = 'response code 404'))
          reject(new ValidationError('The provided URL does not exist'));
      });
  });
};
