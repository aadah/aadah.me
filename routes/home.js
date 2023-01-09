var fs = require('fs')
var express = require('express')

var router = express.Router()

var IMAGES = [
  'bbg-lilies.png',
  'blm_protest/blm_protest_1.png',
  'brooklyn-botanic-2.png',
  'camii_mosque_3.JPG',
  'children.jpg',
  'fireworks.jpg',
  'great-diamond-island-bunker-wall.png',
  'harvard_stadium_bleachers.png',
  'himejijou.JPG',
  'lebanon_2022/byblos_mountain_path_1.png',
  'lebanon_2022/byblos_souk.png',
  'stata.png',
  'storm_king/storm-king-path-5.png',
]

router.get('/', function (req, res, next) {
  var index = Math.floor(Math.random() * IMAGES.length)
  var image = IMAGES[index]
  res.status(200).render('main/home', { image: image })
})

module.exports = router
