var fs = require('fs');
var express = require('express');

var router = express.Router();

router.get('/', function(req, res, next) {
    var image_dir = 'public/media/images/home/';
    fs.readdir(image_dir, function (err, images) {
        if (err) {
            res.status(500).render('error/500');
        } else {
            images = images.filter(function (image) {
                return fs.statSync(image_dir + image).isFile();
            });
            var index = Math.floor(Math.random()*images.length);
            var image = images[index];
            res.status(200).render('main/home', {image: image});
        }
    });
});

module.exports = router;
