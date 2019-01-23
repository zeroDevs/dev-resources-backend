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
      message: 'Something went wrong. Please try again later'
    };
    Resource.find({})
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limit)
      .limit(limit)
      .exec((error, resources) => {
        if (error) {
          reject(response);
        }
        response.error = false;
        response.message = 'Successfully retrieved the resources collection';
        response.payload = {
          start: pageNumber * limit - limit + 1,
          end: pageNumber * limit,
          resources
        };
        resolve(response);
      });
  });
};

resourceHandler.readAll = () => {
  return new Promise((resolve, reject) => {
    let response = {
      error: true,
      message: 'Something went wrong. Please try again later'
    };
    Resource.find({})
      .sort({ createdAt: -1 })
      .exec((error, resources) => {
        if (error) {
          reject(response);
        }
        response.error = false;
        response.message = 'Successfully retrieved the resources collection';
        response.payload = {
          resources
        };
        resolve(response);
      });
  });
};

resourceHandler.delete = link => {
  return new Promise((resolve, reject) => {
    let response = {
      error: true,
      message: 'Something went wrong. Please try again later'
    };
    Resource.deleteOne({ link }, error => {
      if (error) {
        reject(response);
      }
      response.error = false;
      response.message = 'Successfully deleted the link';
      resolve(response);
    });
  });
};

module.exports = resourceHandler;
