var express = require('express')
var parser = require('../utils/parser')

var router = express.Router()

router.get('/*', function (req, res, next) {
  const cleanedPath = req.params[0].replace(/\/$/, '');
  var filePath = `manuscripts/misc/${cleanedPath}.txt`
  parser.web.handler(filePath)(req, res, next)
})

module.exports = router
