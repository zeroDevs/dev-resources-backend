const urlMetadata = require('url-metadata');
const ValidationError = require('../utils/classes/ValidationError');

module.exports = link => {
  return new Promise((resolve, reject) => {
    if (!link) {
      reject(new ValidationError('Link is required'));
    }

    const urlPattern = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;

    if (!urlPattern.test(link)) {
      reject(new ValidationError('Please enter a valid URL'));
    }

    urlMetadata(link)
      .then(() => {
        resolve(true);
      })
      .catch(error => {
        if ((error.Error = 'response code 404'))
          reject(new ValidationError('The provided URL does not exist'));
      });
  });
};
