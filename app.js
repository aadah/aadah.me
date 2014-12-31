var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');

var config = require('./utils/config');

var app = express();

var index = require('./routes/index');
var log = require('./routes/log');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: config.es_secret,
    cookie: config.es_cookie_settings
}));

// routes
app.use('/', index);
app.use('/log', log);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404).render('error/404');
});

module.exports = app;
