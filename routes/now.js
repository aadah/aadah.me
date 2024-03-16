var express = require('express')
var parser = require('../utils/parser')

var router = express.Router()

router.get('/', parser.web.handler('manuscripts/main/now.txt'))

module.exports = router
