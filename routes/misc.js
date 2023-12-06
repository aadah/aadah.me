var express = require('express')
var parser = require('../utils/parser')

var router = express.Router()

router.get('/:ID', function (req, res, next) {
  var filePath = `manuscripts/misc/${req.params.ID}.txt`
  parser.web.handler(filePath)(req, res, next)
})

module.exports = router
