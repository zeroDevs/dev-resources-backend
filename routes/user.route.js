const route = require('express').Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const saveUser = require('../db/user.db');
const userDbHandler = require('../db/user.db');
const saveTokens = require('../db/userTokens.db');
const request = require('request');

const saltRounds = 10;

/**
 * `/auth` should authenticating user
 * `/` should register a new user
 */

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
          `http://localhost:3000/dashboard?uid=${id}&val=${hash}`
      ); // Successful auth
      });
    });
  }
);

// token check
route.post('/verify', (req, res) => {

    let id = req.body.uid;

    saveTokens
      .findUser(id)
      .then(response => {
        let act = response.payload.accessToken;
        bcrypt.compare(act, req.body.hoken, function(err, result) {
          console.log('check');
          console.log(result);
          if (result) {
              let tDate = new Date();
              let hours = Math.floor(Math.abs(tDate - response.payload.createdAt) / 36e5);
              if (hours >= 0 && hours < 24) {
                  res.json({loggedIn: true});
              } else {
                  res.json({loggedIn: false});
              }
              console.log(hours);
          }
        });
      })
      .catch(err => console.log(err.message));
});

route.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = route;
