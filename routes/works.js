var fs = require('fs')
var express = require('express')
var parser = require('../utils/parser')

var router = express.Router()

router.get('/', function (req, res, next) {
  var filePath = 'manuscripts/main/works.txt'
  fs.readFile(filePath, 'utf8', function (err, manuscript) {
    if (err) {
      res.status(500).render('error/500')
    } else {
      try {
        var path = `${req.baseUrl}${req.path}`
        var result = parser.parse(path, manuscript)
        res.status(200).type('text/html').send(result.html)
      } catch (err) {
        res.status(500).render('error/500')
      }
    }
  })
})

module.exports = router
