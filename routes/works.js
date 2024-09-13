var express = require('express')
var parser = require('../utils/parser')

var router = express.Router()

router.get('/', parser.web.handler('manuscripts/main/works.txt'))
router.get('/photo', parser.web.handler('manuscripts/main/photo.txt'))

// for humor writing
var comedy = require('./comedy')
router.use('/comedy', comedy)

// for misc. art projects
var art = require('./art')
router.use('/art', art)

module.exports = router
