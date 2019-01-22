const ValidationError = require('./ValidationError');

module.exports = payload => {
  if (!payload.link) {
    return new ValidationError('Link is required');
  }

  const urlPattern = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;

  if (urlPattern.test(payload.link)) {
    return new ValidationError('Please enter a valid URL');
  }

  if (!payload.meta || typeof payload.meta !== object) {
    return new ValidationError('Please enter a valid meta object');
  }

  if (!payload.author || typeof payload.author !== object) {
    return new ValidationError('Please enter a valid author object');
  }

  if (!payload.author.id || typeof payload.author.id !== string) {
    return new ValidationError('Please enter a valid User ID');
  }

  if (!payload.author.username || typeof payload.author.username !== string) {
    return new ValidationError('Please enter a valid Username');
  }

  if (
    !payload.author.discriminator ||
    typeof payload.author.discriminator !== string
  ) {
    return new ValidationError('Please enter a valid discriminator');
  }

  return true;
};
