var express = require('express')
var parser = require('../utils/parser')

var router = express.Router()

router.get('/', parser.web.handler('manuscripts/main/works.txt'))
router.get('/photo', parser.web.handler('manuscripts/main/photo.txt'))

// for humor writing
var comedy = require('./comedy')
router.use('/comedy', comedy)

module.exports = router
