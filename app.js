var path = require('path');
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');

var config = require('./utils/config');

var home = require('./routes/home');
var blog = require('./routes/blog');
var works = require('./routes/works');
var about = require('./routes/about');
var editor = require('./routes/editor');

var app = express();

mongoose.connect(config.db_connection_string);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// cookies
app.use(session(config.es_settings));

// body parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// routes
app.use('/', home);
app.use('/blog', blog);
app.use('/works', works);
app.use('/about', about);
// app.use('/editor', editor);

// static files
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404).render('error/404');
});

module.exports = app;
