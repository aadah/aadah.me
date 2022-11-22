var fs = require('fs')
var express = require('express')

var router = express.Router()

var IMAGE_DIR = 'public/media/images/'

var IMAGES = [
  'bbg-lilies.png',
  'blm_protest/blm_protest_1.png',
  'brooklyn-botanic-2.png',
  'lebanon_2022/byblos_mountain_path_1.png',
  'lebanon_2022/byblos_souk.png',
  'camii_mosque_3.JPG',
  'children.jpg',
  'fireworks.jpg',
  'great-diamond-island-bunker-wall.png',
  'harvard_stadium_bleachers.png',
  'himejijou.JPG',
  'stata.png',
  'storm_king/storm-king-path-5.png',
]

router.get('/', function (req, res, next) {
  var images = IMAGES.filter(function (image) {
    return IMAGE_DIR + image
  })
  var index = Math.floor(Math.random() * images.length)
  var image = images[index]
  res.status(200).render('main/home', { image: image })
})

module.exports = router
