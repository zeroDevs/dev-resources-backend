const route = require('express').Router();

/**
 * This is the base(`/`) route. We don't need it unless we want to serve front-end from the save server instead of gh-pages
 */
route.get('/', (req, res) =>  res.sendFile((__dirname+'/index.html')));

module.exports = route;