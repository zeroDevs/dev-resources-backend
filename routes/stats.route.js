const route = require('express').Router();
const dbHandler = require('../db/contributor.db');

route.get('/', (req, res) => {
    console.log("test")
    res.send("Stats")
});

route.get('/contributors', async (req, res) => {
    const data = await dbHandler.readAll();
        res.json(data) 
  });

module.exports = route;