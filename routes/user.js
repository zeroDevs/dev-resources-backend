const route = require('express').Router();

/**
 * `/auth` should authenticating user
 * `/new` should register a new user 
 */
route.get('/auth', (req, res) => res.send('write code to auth users'))
route.post('/new', (req, res) => res.send('register a new user'))


module.exports = route;