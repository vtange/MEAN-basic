/*---------------------*/
/*  LOAD DEPENDENCIES  */
/*---------------------*/
var express = require('express');
var path = require('path');             //handles and mutates file and folder paths
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var app = express();/*-----START APP-----*/
/*---------------------*/
/*  LOAD MODELS        */
/*---------------------*/
var mongoose = require('mongoose');
require('./models/Posts');
require('./models/Comments');
/*---------------------*/
/*  CONNECT TO DB 'news'       */
/*---------------------*/
mongoose.connect('mongodb://localhost/news');
/*---------------------*/
/*  LOAD ROUTES        */
/*---------------------*/
var routes = require('./routes/index');                 //fire index.js router
var users = require('./routes/users');                  //fire users.js
/*---------------------*/
/*  DEFINE VIEW ENGINE, FILELOCATIONS       */
/*---------------------*/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));//use favicon in public folder (commented since I don't have one)
app.use(logger('dev'));                                 // use the 'dev' logger from morgan
app.use(bodyParser.json());                             // bodyParser always parses JSON?
app.use(bodyParser.urlencoded({ extended: false }));    // no encoding from bodyParser?
app.use(cookieParser());                                // use cookieParser
app.use(express.static(path.join(__dirname, 'public')));//use all files in public folder
/*---------------------*/
/*  USE ROUTES/SERVE FILES       */
/*---------------------*/
app.use('/', routes);                                   // always use routes/index.js for all urls with '/'
app.use('/users', users);                               // always use routes/users.js for all urls with '/users'

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
