const express = require('express');
const cors = require('cors');

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

app.listen(port, function() {
  console.log('Our app is running on port:' + port);
});
