var express = require('express')
var parser = require('../utils/parser')

var router = express.Router()

router.get('/*', function (req, res, next) {
  var filePath = `manuscripts/misc/${req.params[0]}.txt`
  parser.web.handler(filePath)(req, res, next)
})

module.exports = router
