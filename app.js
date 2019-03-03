const express = require('express');
const cors = require('cors');
const DiscordStrategy = require('passport-discord').Strategy;
const passport = require('passport');
const session = require('express-session');

const saveUser = require('./db/user.db');
const homeRoute = require('./routes/index.route');
const userRoute = require('./routes/user.route');
const resourceRoute = require('./routes/resource.route');

const app = express();
const port = process.env.PORT || 3000;

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/', homeRoute);
app.use('/user', userRoute);
app.use('/resource', resourceRoute);

const scopes = ['identify', 'guilds'];

// "https://dev-resources.herokuapp.com/user/auth/discord/callback"

passport.use(new DiscordStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/user/auth/discord/callback",
    scope: scopes
},
(accessToken, refreshToken, profile, done) => {
    process.nextTick(function() {
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
}), function(req, res) {
    const {id, username, avatar} = req.user;
    console.log(id,username, avatar)
    saveUser.create({id, username, avatar});
    res.redirect('/profile') // Successful auth
});

app.get('/profile', checkAuth, (req, res) => {
    res.json(req.user);
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/')
})

function checkAuth(req, res, next) {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) return next();
    res.send('not logged in :(');
}

app.listen(port, function() {
  console.log('Our app is running on port:' + port);
});
