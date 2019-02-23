const ValidationError = require('../utils/classes/ValidationError');

module.exports = author => {
  return new Promise((resolve, reject) => {
    if (!author || typeof author !== 'object') {
      reject(new ValidationError('Please enter a valid author object'));
    }

    if (!author.id || typeof author.id !== 'string') {
      reject(new ValidationError('Please enter a valid User ID'));
    }

    if (!author.username || typeof author.username !== 'string') {
      reject(new ValidationError('Please enter a valid Username'));
    }

    if (!author.discriminator || typeof author.discriminator !== 'string') {
      reject(new ValidationError('Please enter a valid discriminator'));
    }

    resolve(true);
  });
};
