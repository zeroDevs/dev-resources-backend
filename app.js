const express = require('express');

const homeRoute = require('./routes/index');
const userRoute = require('./routes/user');
const resourceRoute = require('./routes/resource')

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', homeRoute);
app.use('/user', userRoute);
app.use('/resource', resourceRoute);

app.listen(port, function() {
    console.log('Our app is running on port:' + port);
});
