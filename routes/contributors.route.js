const route = require('express').Router();
const dbHandler = require('../db/contributor.db');

route.get('/', async (req, res) => {
    const data = await dbHandler.readAll();
        res.json(data) 
  });

module.exports = route;