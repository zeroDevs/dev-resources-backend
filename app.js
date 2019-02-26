const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const homeRoute = require('./routes/index.route');
const userRoute = require('./routes/user.route');
const resourceRoute = require('./routes/resource.route');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/', homeRoute);
app.use('/user', userRoute);
app.use('/resource', resourceRoute);

app.use((err, req, res, next) => {
    switch (err.message) {
        case 'NoCodeProvided':
            return res.status(400).send({
                status: 'ERROR',
                error: err.message
            });
            break;
        default:
        return res.status(500).send({
            status: 'ERROR',
            error: err.message
        });
    }
});

app.get('/user', (req, res) => {
    if(req.query.token === undefined) return res.status(500).json({error: "no token"});

    const token = req.query.token;
    fetch('https://discordapp.com/api/users/@me', {
        method: 'get',
        headers: {'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(json => res.json(json));

})

app.listen(port, function() {
  console.log('Our app is running on port:' + port);
});
