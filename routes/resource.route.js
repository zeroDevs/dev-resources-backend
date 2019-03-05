/**
 * Base Route: /resource/
 * This are the routes for manipulating _resources_
 */
const route = require('express').Router();
const dbHandler = require('../db/resource.db');
const userDbHandler = require('../db/user.db');
const allTopics = require('../controller/allReads');

/**
 * `/all` - Returns all entries available in database
 */
route.get('/all', async (req, res) => {
  const data = await dbHandler.readAll();
  console.log(data.error, data.message);

  allTopics();
  if (data.error) res.send('Something went wrong, try again later!');
  else {
    let prefixedData = {};
    data.payload.resources.forEach(e=> {
      if (!e.meta.title) e.meta.title = 'No Title Was Set';
      const id = e._id;
      // Remove all non-alphanumerics
      const stripSpecials = e.meta.title.replace(/[^a-zA-Z0-9 ]/g, '');
      // Remove Duplicate space
      const stripSpaces = stripSpecials.replace(/\s\s+/g, ' ');
      //  Replace spaces with hyphens and convert to lowercase
      const prefix =
        stripSpaces.replace(/\s+/g, '-').toLowerCase() +
        '-' +
        id.toString().slice(0, 5);

      prefixedData[prefix] = e;
    });
    res.json(prefixedData);
  }
});

/**
 * `/:user/bookmark` is a GET route which should return only the resources user bookmarked.`/:user` should be replaced with user id(or username) on runtime.
 */
route.get('/:userId/bookmark', (req, res) => {
  userDbHandler.retrieveBookmarks(req.params.userId)
    .then(response => res.send({
      error: false,
      message: response.message,
      payload: {
        bookmarks: response.payload.bookmarks
      }
    }))
    .catch(error => {
      res.status(500).json({
        error: true,
        message: error.message
      })
    });
});
/**
 * `/:user/bookmark` is a POST route which save resources as a bookmark under that specific user.`/:user` should be replaced with user id(or username) on runtime.
 */
route.post('/:resourceSlug/:userId/bookmark', (req, res) => {
  userDbHandler.addBookmark({
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
      })
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
      userId: req.params.userId
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
