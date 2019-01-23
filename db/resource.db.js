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

resourceHandler.read = ({ pageNumber, limit }) => {
  return new Promise((resolve, reject) => {
    let response = {
      error: true,
      message: ''
    };
    Resource.find({})
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limit)
      .limit(limit)
      .exec((error, resources) => {
        if (error) {
          response.message = 'Something went wrong. Please try again later.';
          reject(response);
        }
        response.message = 'Successfully retrieved the resources list';
        response.payload = {
          start: pageNumber * limit - limit + 1,
          end: pageNumber * limit,
          resources
        };
        resolve(response);
      });
  });
};

module.exports = resourceHandler;
