var express = require('express')
var parser = require('../utils/parser')

var router = express.Router()

router.get('/', parser.handler('manuscripts/main/works.txt'))

module.exports = router
