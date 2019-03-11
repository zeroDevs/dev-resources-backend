const route = require('express').Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const saveUser = require('./db/user.db');
const userDbHandler = require('../db/user.db');

/**
 * `/auth` should authenticating user
 * `/` should register a new user
 */

function checkAuth(req, res, next) {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) return next();
  res.json({ error: 'notLoggedIn', status: res.statusCode });
}

route.get('/auth/discord', passport.authenticate('discord'));

/**
 * `/:user/bookmark` is a GET route which should return only the resources user bookmarked.`/:user` should be replaced with user id(or username) on runtime.
 */
route.get('/:userId/bookmark', (req, res) => {
  userDbHandler
    .retrieveBookmarks(req.params.userId)
    .then(response =>
      res.send({
        error: false,
        message: response.message,
        payload: {
          bookmarks: response.payload.bookmarks
        }
      })
    )
    .catch(error => {
      res.status(500).json({
        error: true,
        message: error.message
      });
    });
});

route.get(
  '/auth/discord/callback',
  passport.authenticate('discord', {
    failureRedirect: '/'
  }),
  function(req, res) {
    const { id, username, avatar, accessToken, discriminator } = req.user;

    bcrypt.genSalt(saltRounds, function(err, salt) {
      bcrypt.hash(accessToken, salt, function(err, hash) {
        console.log(id, username, avatar, discriminator);
        saveUser.create({ id, username, avatar, discriminator });

        res.redirect(
          `https://rustyresources.herokuapp.com/dashboard?uid=${id}&val=${hash}`
        ); // Successful auth
      });
    });
  }
);

route.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = route;
