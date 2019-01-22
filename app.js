const express = require('express');

const homeRoute = require('./routes/index');
const userRoute = require('./routes/user');
const resourceRoute = require('./routes/resource')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', homeRoute);
app.use('/user', userRoute);
app.use('/resource', resourceRoute);

app.listen(3000);