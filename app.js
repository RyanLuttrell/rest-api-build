'use strict';

// load modules
const express = require('express');
const Sequelize = require('sequelize');
const morgan = require('morgan');
const userRoutes = require('./routes/user');
const courseRoutes = require('./routes/course');

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// Parse the data coming in from express to JSON so that it can by used in the routes
app.use(express.json())

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// TODO setup your api routes here
app.use('/api', userRoutes);
app.use('/api', courseRoutes);

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './fsjstd-restapi.db',
  logging: false
})

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

  sequelize.sync({ force: true })
  .then(() => {
    console.log('We are cooking with fire now');
  })
  .catch(err => {
    console.error('Looks like we still have some work to do')
  }) 

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
