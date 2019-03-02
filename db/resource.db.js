const urlMetadata = require('url-metadata');
const Resource = require('../models/resource.model');
const validator = require('../validations/resource.vaidation');
const authorValidator = require('../validations/author.validation');
const linkValidator = require('../validations/link.valdation');
const utils = require('../utils');
const Response = require('../utils/classes/Response');
const mongoose = require('mongoose');

const resourceHandler = {};

resourceHandler.create = ({ link, author }) => {
  return new Promise((resolve, reject) => {
    const response = new Response();
    validator({ link, author })
      .then(() => {
        urlMetadata(link).then(metadata => {
          const meta = {
            title: metadata.title,
            image: utils.normalizeUrl(metadata.image, utils.getDomain(link)),
            description: metadata.description
          };
          const _id = mongoose.Types.ObjectId();
          const slug =
            meta.title
              .replace(/[^a-zA-Z0-9 ]/g, '')
              .replace(/\s\s+/g, ' ')
              .replace(/\s+/g, '-')
              .toLowerCase() +
            '-' +
            _id.toString().slice(0, 5);
          this._id.toString().slice(0, 5);
          const resource = new Resource({
            link,
            meta,
            author,
            slug
          });
          resource.save(error => {
            if (error) {
              response.setMessage(error.message);
              response.setPayload({ url: link });
              reject(response);
            } else {
              response.setSuccess();
              response.setMessage('Successfully added into the database');
              response.setPayload({
                title: metadata.title,
                url: link,
                description: metadata.description,
                image: metadata.image
              });
              resolve(response);
            }
          });
        });
      })
      .catch(error => {
        response.setMessage(error.message);
        response.setPayload({ url: link });
        reject(response);
      });
  });
};

resourceHandler.read = ({ pageNumber, limit }) => {
  return new Promise((resolve, reject) => {
    const response = new Response();
    Resource.find({})
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limit)
      .limit(limit)
      .exec((error, resources) => {
        if (error) reject(response);
        response.setSuccess();
        response.setMessage('Successfully retrieved the resources collection');
        response.setPayload({
          start: pageNumber * limit - limit + 1,
          end: pageNumber * limit,
          resources
        });
        resolve(response);
      });
  });
};

resourceHandler.readAll = () => {
  return new Promise((resolve, reject) => {
    const response = new Response();
    Resource.find({})
      .sort({ createdAt: -1 })
      .exec((error, resources) => {
        if (error) reject(response);
        response.setSuccess();
        response.setMessage('Successfully retrieved the resources collection');
        response.setPayload({
          resources
        });
        resolve(response);
      });
  });
};

resourceHandler.updateLink = ({ oldLink, newLink }) => {
  return new Promise((resolve, reject) => {
    const response = new Response();
    linkValidator(newLink)
      .then(() => {
        Resource.findOneAndUpdate(
          { link: oldLink },
          { $set: { link: newLink } },
          error => {
            if (error) reject(response);
            response.setSuccess();
            response.setMessage('Successfully updated the link');
            resolve(response);
          }
        );
      })
      .catch(error => {
        response.setMessage(error.message);
        reject(response);
      });
  });
};

resourceHandler.updateAuthor = ({ link, author }) => {
  return new Promise((resolve, reject) => {
    const response = new Response();
    authorValidator(author)
      .then(() => {
        Resource.findOneAndUpdate(
          { link },
          { $set: { author: author } },
          error => {
            if (error) reject(response);
            response.setSuccess();
            response.setMessage('Successfully updated the author');
            resolve(response);
          }
        );
      })
      .catch(error => {
        response.setMessage(error.message);
        reject(response);
      });
  });
};

resourceHandler.delete = link => {
  return new Promise((resolve, reject) => {
    const response = new Response();
    Resource.deleteOne({ link }, error => {
      if (error) reject(response);
      response.setSuccess();
      response.setMessage('Successfully deleted the link');
      resolve(response);
    });
  });
};

resourceHandler.search = (searchKey, { pageNumber, limit }) => {
  return new Promise((resolve, reject) => {
    const response = new Response();
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
        response.setSuccess();
        response.setMessage('Search operation was successful');
        response.setPayload({
          start: pageNumber * limit - limit + 1,
          end: pageNumber * limit,
          resources
        });
        resolve(response);
      });
  });
};

resourceHandler.searchAll = searchKey => {
  return new Promise((resolve, reject) => {
    const response = new Response();
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
        response.setSuccess();
        response.setMessage('Search operation was successful');
        response.setPayload({
          resources
        });
        resolve(response);
      });
  });
};

resourceHandler.upvote = ({ slug, userId }) => {
  return new Promise((resolve, reject) => {
    const response = new Response();
    Resource.findOneAndUpdate(
      {
        slug
      },
      {
        $addToSet: {
          upvotes: userId
        }
      },
      (error, resource) => {
        if (error) reject(response);
        response.setSuccess();
        response.setMessage('Successfully upvoted');
        response.setPayload({
          upvote: resource.upvotes.length
        });
        resolve(response);
      }
    );
  });
};

resourceHandler.setTag = ({ slug, tag, userId }) => {
  return new Promise((resolve, reject) => {
    const response = new Response();
    Resource.findOneAndUpdate(
      {
        slug
      },
      {
        $addToSet: {
          tags: tag.toLowerCase() + '-' + userId
        }
      },
      (error, resource) => {
        if (error) reject(response);
        response.setSuccess();
        response.setMessage('Successfully added the tag');
        response.setPayload({
          tags: resource.tags
        });
        resolve(response);
      }
    );
  });
};

resourceHandler.downvote = ({ slug, userId }) => {
  return new Promise((resolve, reject) => {
    const response = new Response();
    Resource.findOneAndUpdate(
      {
        slug
      },
      {
        $push: {
          downvotes: userId
        }
      },
      error => {
        if (error) reject(response);
        response.setSuccess();
        response.setMessage('Successfully downvoted');
        resolve(response);
      }
    );
  });
};

resourceHandler.resourceCount = () => {
  return new Promise((resolve, reject) => {
    const response = new Response();
    Resource.count({}, (error, count) => {
      if (error) reject(response);
      response.setSuccess();
      response.setMessage('Count operation was successful');
      response.setPayload({
        count
      });
      resolve(response);
    });
  });
};

resourceHandler.votesCount = () => {
  return new Promise((resolve, reject) => {
    const response = new Response();
    Resource.find({}, (error, resources) => {
      if (error) reject(response);
      let payload = resources.reduce(
        (acc, resource) => {
          acc.upvotesCount += resource.upvotes.length;
          acc.downvotesCount += resourc.upvotes.length;
          return acc;
        },
        { upvotesCount: 0, downvotesCount: 0 }
      );
      response.setSuccess();
      response.setMessage('Votes count operation was successful');
      response.setPayload(payload);
      resolve(respone);
    });
  });
};

module.exports = resourceHandler;
