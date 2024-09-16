var express = require('express')
var parser = require('../utils/parser')

var router = express.Router()

router.get('/', parser.web.handler('manuscripts/main/art.txt'))

router.get('/:ID', function (req, res, next) {
  var filePath = `manuscripts/art/${req.params.ID}.txt`
  parser.web.handler(filePath)(req, res, next)
})

module.exports = router
