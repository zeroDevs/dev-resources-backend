/**
 * Base Route: /resource/
 * This are the routes for manipulating _resources_
 */
const route = require('express').Router();
const dbHandler = require('../db/resource.db');
const userDbHandler = require('../db/user.db');
//const allRelatedResource = require('../controller/allRelatedResource');

/**
 * `/all` - Returns all entries available in database
 */
route.get('/all', async (req, res) => {
  let data;
  try {
    data = await dbHandler.readAll();
  } catch (e) {
    return res
      .status(500)
      .json({ message: 'Something went wrong. Please try again later' });
  }
  if (data.error) return res.status(500).json(data);
  res.json(data);
});

route.get('/', async (req, res) => {
  let data;
  try {
    data = await dbHandler.read({
      pageNumber: Number.parseInt(req.query.page),
      limit: Number.parseInt(req.query.limit)
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: 'Something went wrong. Please try again later' });
  }
  if (data.error) return res.status(500).json(data);
  res.json(data);
});

route.get('/:resourceSlug', async (req, res) => {
  let resource;
    try {
      resource = await dbHandler.getResource(req.params.resourceSlug);
    } catch(e) {
      return res
      .status(500)
      .json({ message: 'Something went wrong. Please try again later' });
    } 

    if (resource.error) return res.status(500).json(resource);
    
    res.json(resource);
});

/**
 * `/:user/bookmark` is a POST route which save resources as a bookmark under that specific user.`/:user` should be replaced with user id(or username) on runtime.
 */
route.post('/:resourceSlug/:userId/bookmark', (req, res) => {
  userDbHandler
    .addBookmark({
      userId: req.params.userId,
      resourceSlug: req.params.resourceSlug
    })
    .then(response => {
      res.json({
        error: false,
        message: response.message,
        payload: {
          bookmarksLength: response.payload.bookmark
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        error: true,
        message: error.message
      });
    });
});

route.post('/:resourceSlug/:userId/comment', (req,res) => {
  dbHandler.comment({
    slug: req.params.resourceSlug,
    comment: req.body
  })
  .then(response => {
    res.json({
      error: false,
      message: response.message,
      payload: {
        comment: response.payload
      }
    });
  })
  .catch(error => {
    res.status(500).json({
      error: true,
      message: error.message
    });
  });
});

route.post('/:resourceSlug/:userId/upvote', (req, res) => {
  dbHandler
    .upvote({
      slug: req.params.resourceSlug,
      userId: req.params.userId,
      upvote: req.body.isUpvote
    })
    .then(response => {
      res.json({
        error: false,
        message: response.message,
        payload: {
          upvote: response.payload.upvote
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        error: true,
        message: error.message
      });
    });
});

route.post('/:resourceSlug/:userId/tag', (req, res) => {
  dbHandler
    .setTag({
      userId: req.params.userId,
      slug: req.params.resourceSlug,
      tag: req.body.tag
    })
    .then(response => {
      res.json({
        error: false,
        message: response.message,
        payload: {
          tags: response.payload.tags
        }
      });
    });
});

route.post('/:resourceSlug/:userId/downvote', (req, res) => {
  dbHandler
    .downvote({
      slug: req.params.resourceSlug,
      userId: req.params.userId
    })
    .then(response => {
      res.json({
        error: false,
        message: response.message,
        payload: {
          count: response.payload.count
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        error: true,
        message: error.message
      });
    });
});

module.exports = route;
