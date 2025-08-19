var path = require('path')
var express = require('express')
var bodyParser = require('body-parser')

var app = express()

var home = require('./routes/home')
var blog = require('./routes/blog')
var works = require('./routes/works')
var now = require('./routes/now')
var about = require('./routes/about')
var misc = require('./routes/misc')

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// middleware
app.use(bodyParser.urlencoded({ extended: true }))

// routes
app.use('/', home)
app.use('/blog', blog)
app.use('/works', works)
app.use('/now', now)
app.use('/about', about)
app.use('/misc', misc)

// for my puzzle
var puzzle = require('./routes/puzzle')
app.use('/misc/puzzle', puzzle)

// static files
app.use(express.static(path.join(__dirname, 'public')))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).render('error/404')
})

module.exports = app
