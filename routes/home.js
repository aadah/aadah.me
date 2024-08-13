var express = require('express')
var parser = require('../utils/parser')

var router = express.Router()

var IMAGES = [
  // my locally hosted images
  '/media/images/bbg-lilies.png',
  '/media/images/blm_protest/blm_protest_1.png',
  '/media/images/brooklyn-botanic-2.png',
  '/media/images/children.jpg',
  '/media/images/fireworks.jpg',
  '/media/images/great-diamond-island-bunker-wall.png',
  '/media/images/harvard_stadium_bleachers.png',
  '/media/images/himejijou.JPG',
  '/media/images/lebanon_2022/byblos_mountain_path_1.png',
  '/media/images/lebanon_2022/byblos_souk.png',
  '/media/images/stata.png',
  '/media/images/storm_king/storm-king-path-5.png',

  // my images hosted elsewhere
  'https://mastodon.mit.edu/system/media_attachments/files/110/952/813/571/606/256/original/3e9f841de5d6b8c3.jpg',
  'https://mastodon.mit.edu/system/media_attachments/files/111/651/094/839/514/862/original/1b0d6a736db8df0a.jpg',
  'https://mastodon.mit.edu/system/media_attachments/files/111/879/362/235/552/285/original/80c4dd1bad1e455d.jpg',
  'https://mastodon.mit.edu/system/media_attachments/files/110/682/808/712/825/718/original/ef256851bdfce2d0.jpg',
  'https://mastodon.mit.edu/system/media_attachments/files/111/682/295/720/395/669/original/943372f64c2d7b86.jpg',
  'https://mastodon.mit.edu/system/media_attachments/files/111/705/098/563/938/086/original/f30e067d24df8105.jpg',
  'https://mastodon.mit.edu/system/media_attachments/files/111/705/098/191/567/569/original/48e9bc2268d6014d.jpg',
  'https://social-coop-media.ams3.cdn.digitaloceanspaces.com/media_attachments/files/112/356/680/545/068/533/original/504dc756fa36dc8d.jpg',
  'https://social-coop-media.ams3.cdn.digitaloceanspaces.com/media_attachments/files/112/940/996/029/241/076/original/acb9de6c78e2011e.jpg'
]

router.get('/', function (req, res, next) {
  var index = Math.floor(Math.random() * IMAGES.length)
  var image = IMAGES[index]
  parser.web.handler('manuscripts/main/home.txt', { 'IMAGE': image })(req, res, next)
})

module.exports = router
