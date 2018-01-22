var fs = require('fs')
var express = require('express')

var router = express.Router()

router.get('/', function (req, res, next) {
  var imageDir = 'public/media/images/home/'
  fs.readdir(imageDir, function (err, images) {
    if (err) {
      res.status(500).render('error/500')
    } else {
      images = images.filter(function (image) {
        return fs.statSync(imageDir + image).isFile()
      })
      var index = Math.floor(Math.random() * images.length)
      var image = images[index]
      res.status(200).render('main/home', {image: image})
    }
  })
})

module.exports = router
