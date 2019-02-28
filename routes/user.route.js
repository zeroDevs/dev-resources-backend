const route = require('express').Router();
const passport = require('passport');

/**
 * `/auth` should authenticating user
 * `/new` should register a new user
 */

route.get('/auth/discord', passport.authenticate('discord'));

route.post('/new', (req, res) => res.send('register a new user'))


module.exports = route;
