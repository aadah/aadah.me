var express = require('express')
var parser = require('../utils/parser')

var router = express.Router()

router.get('/', parser.handler('manuscripts/main/comedy.txt'))

router.get('/:ID', function (req, res, next) {
  var filePath = `manuscripts/comedy/${req.params.ID}.txt`
  parser.handler(filePath)(req, res, next)
})

module.exports = router
