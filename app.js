var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');

var config = require('./utils/config');

var home = require('./routes/home');
var blog = require('./routes/blog');
var works = require('./routes/works');
var about = require('./routes/about');
// var log = require('./routes/log');

var app = express();

mongoose.connect(config.db_connection_string);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// body parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// routes
app.use('/', home);
app.use('/blog', blog);
app.use('/works', works);
app.use('/about', about);
// app.use('/log', log);

// static files
app.use(express.static(path.join(__dirname, 'public')));

// cookies
app.use(session({
    secret: config.es_secret,
    cookie: config.es_cookie_settings
}));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404).render('error/404');
});

module.exports = app;
