var express = require('express')
var parser = require('../utils/parser')

var router = express.Router()

router.get('/', parser.handler('manuscripts/main/works.txt'))

// for humor writing
var comedy = require('./comedy')
router.use('/comedy', comedy)

module.exports = router
