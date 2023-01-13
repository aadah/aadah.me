var express = require('express')
var parser = require('../utils/parser')

var router = express.Router()

router.get('/', parser.web.handler('manuscripts/main/about.txt'))

router.get('/resume', function (req, res, next) {
  res.status(200).render('main/resume')
})

module.exports = router
