const mongoose = require('mongoose');
const urlMetadata = require('url-metadata');
const config = require('../config.json');
const Resource = require('../models/resource.model');
const validator = require('../validations/resource.vaidation');
const utils = require('../utils');

mongoose.Promise = Promise;
mongoose.connect(
  config.mongourl,
  { useMongoClient: true }
);

const resourceHandler = {};

resourceHandler.create = ({ link, author }) => {
  return new Promise((resolve, reject) => {
    let payload = {
      error: true,
      message: ''
    };
    validator({ link, author })
      .then(() => {
        urlMetadata(link).then(metadata => {
          const meta = {
            title: metadata.title,
            image: utils.normalizeUrl(metadata.image, utils.getDomain(link)),
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
              reject(payload);
            } else {
              payload.error = false;
              payload.message = 'Successfully added into the database';
              resolve(payload);
            }
          });
        });
      })
      .catch(error => {
        console.log(error.message);
        payload.message = error.message;
        reject(payload);
      });
  });
};

module.exports = resourceHandler;
