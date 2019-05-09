const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const saveUser = require('../db/user.db');
const saveTokens = require('../db/userTokens.db');

const scopes = ['identify', 'guilds'];

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL:
        'https://dev-resources.herokuapp.com/user/auth/discord/callback',
      scope: scopes
    },
    (accessToken, refreshToken, profile, done) => {
      process.nextTick(function() {
        console.log(profile);

        saveUser
          .addGuild({
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
        console.log("tokens", accessToken, refreshToken);
        saveTokens.fuCreate({ id, username, accessToken, refreshToken });
        return done(null, profile);
      });
    }
  )
);

module.exports = passport;
