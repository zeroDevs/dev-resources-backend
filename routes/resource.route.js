/**
 * Base Route: /resource/
 * This are the routes for manipulating _resources_
 */
const route = require('express').Router();
const dbHandler = require('../db/resource.db');

/**
 * `/all` - Returns all entries available in database
 */
route.get('/all', async (req, res) => {
    const data = await dbHandler.readAll();
    console.log(data.error, data.message);
    
    if(data.error) res.send('Something went wrong, try again later!');
    else res.json(data.payload.resources);
    
})

/**
 * `/:user/bookmark` is a GET route which should return only the resources user bookmarked.`/:user` should be replaced with user id(or username) on runtime.
 */
route.get('/:user/bookmark', (req, res) => {
    res.send(`code to send resource saved as bookmark by ${req.params.user}`)
})

/**
 * `/:user/bookmark` is a POST route which save resources as a bookmark under that specific user.`/:user` should be replaced with user id(or username) on runtime.
 */
route.post('/:user/bookmark', (req, res) => {
    res.send(`code to add a new bookmark by ${req.params.user}`)
})


module.exports = route;