const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./auth/passport');

const homeRoute = require('./routes/index.route');
const userRoute = require('./routes/user.route');
const resourceRoute = require('./routes/resource.route');
const statseRoute = require('./routes/stats.route');
const profileRoutes = require('./routes/profile.route');
const contribRoute = require('./routes/contributors.route');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

app.use(
  session({
    secret: 'super batman',
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/', homeRoute);
app.use('/user', userRoute);
app.use('/resource', resourceRoute);
app.use('/stats', statseRoute);
app.use('/contributors', contribRoute);
app.use('/profile', profileRoutes);

app.listen(port, function() {
  console.log('Our app is running on port:' + port);
});

// process.on('uncaughtException', function() {
//   server.close();
// })