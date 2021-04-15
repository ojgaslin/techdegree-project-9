'use strict'; 
// load modules
var sequelize = require('./models/index').sequelize;
const express = require('express');
const morgan = require('morgan');
var path = require('path');
var routes = require('./routes/index');
var users = require('./routes/users');
var courses = require('./routes/courses');

// create the Express app
const app = express();

app.use(express.json());
//setup routes
app.use('/api', routes);
app.use('/api/users', users);
app.use('/api/courses', courses);

sequelize
  .authenticate()
  .then(function() {
    console.log('Connection has been established successfully.');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });

  sequelize.sync();//{ force: true }

  app.use(express.static(path.join(__dirname, 'public')));

  // variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';



// setup morgan which gives us http request logging
app.use(morgan('dev'));

// TODO setup your api routes here

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});


  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Page Not Found');
    err.status = 404;
    next(err);
  });
  

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500).send(err);

  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500).send();
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});

module.exports = app; 