const express = require('express');
const cors = require('cors');
const DiscordStrategy = require('passport-discord').Strategy;
const passport = require('passport');
const session = require('express-session');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const fetch = require('node-fetch');
const bodyParser = require('body-parser')
const CronJob = require('cron').CronJob;

const saveUser = require('./db/user.db');
const saveTokens = require('./db/userTokens.db');
const homeRoute = require('./routes/index.route');
const userRoute = require('./routes/user.route');
const resourceRoute = require('./routes/resource.route');
const statseRoute = require('./routes/stats.route');
const contribRoute = require('./routes/contributors.route');

const getContribs = require('./utils/getContribs');

new CronJob('0 */10 * * * *', async function () {
    getContribs()
}, null, true, 'America/Los_Angeles');

const app = express();
const port = process.env.PORT || 3001;

passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/', homeRoute);
app.use('/user', userRoute);
app.use('/resource', resourceRoute);
app.use('/stats', statseRoute)
app.use('/contributors', contribRoute)

const scopes = ['identify', 'guilds'];

// not needed anymore
function checkAuth(req, res, next) {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) return next();
    res.json({ error: 'notLoggedIn', status: res.statusCode });
}

passport.use(new DiscordStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "https://dev-resources.herokuapp.com/user/auth/discord/callback",
    scope: scopes
},
    (accessToken, refreshToken, profile, done) => {
        process.nextTick(function () {
            console.log(profile);

            saveUser.addGuild({
                  userId: profile.id,
                  guilds: profile.guilds
                })
                  .then(response => {
                    console.log(response);
                  })
                  .catch(error => {
                    console.error(error);
                  });
            const { id, username } = profile;
            saveTokens.create({ id, username, accessToken, refreshToken });
            return done(null, profile);
        });
    }));

app.use(session({
    secret: 'super batman',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/user/auth/discord/callback', passport.authenticate('discord', {
    failureRedirect: '/'
}), function (req, res) {
    const { id, username, avatar, accessToken, discriminator } = req.user;

    bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(accessToken, salt, function (err, hash) {
            console.log(id, username, avatar, discriminator);
            saveUser.create({ id, username, avatar, discriminator });

            res.redirect(`https://rustyresources.herokuapp.com/dashboard?uid=${id}&val=${hash}`); // Successful auth
        });
    });

});

app.use(bodyParser.json());

app.get('/profile', checkAuth, (req, res) => {
    res.send(req.user);
});

app.post('/profile', (req, res) => {
    console.log(JSON.stringify(req.body));
    let id = req.body.uid;
    console.log(req.body.id);
    console.log(typeof id);
    saveTokens.findUser(id)
        .then(response => {
            let act = response.payload.accessToken;
            bcrypt.compare(act, req.body.hoken, function (err, response) {
                if (response) {
                    saveUser.retrieveUser(id)
                      .then(response => {
                          res.json({
                                payload: response.payload
                              })
                          })
                          .catch(error => {
                            res.status(500).json({
                              error: true,
                              message: error.message
                            })
                          });
                }
            });
        })
        .catch(err => console.log(err.message));
})

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/')
})




app.listen(port, function () {
    console.log('Our app is running on port:' + port);
});
