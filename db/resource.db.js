const mongoose = require('mongoose');
const config = require('../config.json');
const Resource = require('../models/resource.model');
const validator = require('../validations/resource.vaidation');
const ValidationError = require('../validations/ValidationError');
const urlMetadata = require('url-metadata');

mongoose.Promise = Promise;
mongoose.connect(
  config.mongourl,
  { useMongoClient: true }
);

const resourceHandler = {};

resourceHandler.create = ({ link, author }, callback) => {
  let payload = {
    error: true,
    message: ''
  };
  const validationResult = validator({ link, author });
  if (validationResult instanceof ValidationError) {
    payload.message = validationResult.message;
    callback(payload);
  } else {
    urlMetadata(link).then(metadata => {
      const meta = {
        title: metadata.title,
        image: metadata.image,
        description: metadata.description
      };
      const resource = new Resource({
        link,
        meta,
        author
      });
      resource.save(error => {
        if (error) {
          payload.message =
            'There is a problem adding into the database. Please try agian later';
          callback(payload);
        } else {
          payload.error = false;
          payload.message = 'Successfully added into the database';
          callback(payload);
        }
      });
    });
  }
};

module.exports = resourceHandler;
