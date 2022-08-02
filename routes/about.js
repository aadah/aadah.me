var express = require('express')

var router = express.Router()

router.get('/', function (req, res, next) {
  res.status(200).render('main/about')
})

router.get('/resume', function (req, res, next) {
  res.status(200).render('main/resume')
})

module.exports = router
