const route = require('express').Router();

const fetch = require('node-fetch');
const btoa = require('btoa');
const {catchAsync} = require('../utils');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const redirect = encodeURIComponent('http://localhost:3000/user/callback');

/**
 * `/auth` should authenticating user
 * `/new` should register a new user
 */

route.get('/auth', (req, res) => {
    res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${redirect}`);
})

route.get('/callback', catchAsync(async (req, res) => {
    if(!req.query.code) throw new Error('NoCodeProvided');
    const code = req.query.code;
    const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
    const response = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect}`,
        {
            method: 'POST',
            headers: {
                Authorization: `Basic ${creds}`,
            },
        });

        const json = await response.json();
        res.redirect(`/user/?token=${json.access_token}`);
}));


route.post('/new', (req, res) => res.send('register a new user'))


module.exports = route;
