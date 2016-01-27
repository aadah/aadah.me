var path = require('path');
var https = require('https');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');

var config = require('./utils/config');

var app = express();

var home = require('./routes/home');
var blog = require('./routes/blog');
var works = require('./routes/works');
var about = require('./routes/about');
var account = require('./routes/account');
var preview = require('./routes/preview');

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
app.use('/account', account);
app.use('/preview', preview);

// static files
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404).render('error/404');
});

module.exports = https.createServer(config.creds, app);
