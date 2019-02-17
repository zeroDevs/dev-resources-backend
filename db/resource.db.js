const urlMetadata = require('url-metadata');
const Resource = require('../models/resource.model');
const validator = require('../validations/resource.vaidation');
const authorValidator = require('../validations/author.validation');
const linkValidator = require('../validations/link.valdation');
const utils = require('../utils');

const resourceHandler = {};

resourceHandler.create = ({ link, author }) => {
  return new Promise((resolve, reject) => {
    let response = {
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
              response.message =
                'There is a problem adding into the database. Please try agian later';
              reject(response);
            } else {
              response.error = false;
              response.message = 'Successfully added into the database';
              response.payload = {
                title: metadata.title,
                url: link,
                description: metadata.description,
                image: metadata.image
              };
              resolve(response);
            }
          });
        });
      })
      .catch(error => {
        response.message = error.message;
        reject(response);
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
        if (error) reject(response);
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
        if (error) reject(response);
        response.error = false;
        response.message = 'Successfully retrieved the resources collection';
        response.payload = {
          resources
        };
        resolve(response);
      });
  });
};

resourceHandler.updateLink = ({ oldLink, newLink }) => {
  return new Promise((resolve, reject) => {
    let response = {
      error: true,
      message: 'Something went wrong. Please try again later'
    };
    linkValidator(newLink)
      .then(() => {
        Resource.findOneAndUpdate(
          { link: oldLink },
          { $set: { link: newLink } },
          error => {
            if (error) reject(response);
            response.error = false;
            response.message = 'Successfully updated the link';
            resolve(response);
          }
        );
      })
      .catch(error => {
        response.message = error.message;
        reject(response);
      });
  });
};

resourceHandler.updateAuthor = ({ link, author }) => {
  return new Promise((resolve, reject) => {
    let response = {
      error: true,
      message: 'Something went wrong. Please try again later'
    };
    authorValidator(author)
      .then(() => {
        Resource.findOneAndUpdate(
          { link },
          { $set: { author: author } },
          error => {
            if (error) reject(response);
            response.error = false;
            response.message = 'Successfully updated the author';
            resolve(response);
          }
        );
      })
      .catch(error => {
        response.message = error.message;
        reject(response);
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
      if (error) reject(response);
      response.error = false;
      response.message = 'Successfully deleted the link';
      resolve(response);
    });
  });
};

resourceHandler.search = (searchKey, { pageNumber, limit }) => {
  return new Promise((resolve, reject) => {
    let response = {
      error: true,
      message: 'Something went wrong. Please try again later'
    };
    let escapedSearchKey = utils.escapeString(searchKey);
    let regExpKey = new RegExp(`.*${escapedSearchKey}.*`, 'u');
    Resource.find({
      $or: [
        { link: regExpKey },
        { 'meta.title': regExpKey },
        { 'meta.description': regExpKey }
      ]
    })
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limit)
      .limit(limit)
      .exec((error, resources) => {
        if (error) reject(response);
        response.error = false;
        response.message = 'Search operation was successful';
        response.payload = {
          start: pageNumber * limit - limit + 1,
          end: pageNumber * limit,
          resources
        };
        resolve(response);
      });
  });
};

resourceHandler.searchAll = searchKey => {
  return new Promise((resolve, reject) => {
    let response = {
      error: true,
      message: 'Something went wrong. Please try again later'
    };
    let escapedSearchKey = utils.escapeString(searchKey);
    let regExpKey = new RegExp(`.*${escapedSearchKey}.*`, 'u');
    Resource.find({
      $or: [
        { link: regExpKey },
        { 'meta.title': regExpKey },
        { 'meta.description': regExpKey }
      ]
    })
      .sort({ createdAt: -1 })
      .exec((error, resources) => {
        if (error) reject(response);
        response.error = false;
        response.message = 'Search operation was successful';
        response.payload = {
          resources
        };
        resolve(response);
      });
  });
};

module.exports = resourceHandler;
