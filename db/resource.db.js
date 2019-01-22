const mongoose = require('mongoose');
const config = require('../config.json');
const Resource = require('../models/resource.model');
const validator = require('../validations/resource.vaidation');

mongoose.set(`'useCreateIndex`, true);
mongoose.connect(
  config.mongourl,
  { useNewUrlParser: true }
);

const resourceHandler = {};

resourceHandler.create = ({ link, meta, author }) => {
  const validationResult = validator({ link, meta, author });
  if (validationResult) {
    const resource = new Resource({
      link,
      meta,
      author
    });
    resource.save(error => {
      if (error) {
        return {
          error: true,
          message:
            'There is a problem adding into the database. Please try agian later'
        };
      }
      return {
        error: false,
        message: 'Successfully added into the database'
      };
    });
  } else {
    return {
      error: true,
      message: validationResult.message
    };
  }
};

module.exports = resourceHandler;
