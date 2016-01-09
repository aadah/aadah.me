var fs = require('fs');
var express = require('express');
var auth = require('../utils/auth');

var router = express.Router();

router.get('/', function(req, res, next) {
    var image_dir = 'public/media/images/';
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

// router.get('/editor', auth.requireValidation, function(req, res) {
//     // TODO: create editor page
// });

// router.get('/preview', auth.requireValidation, function(req, res) {
//     // TODO: create preview page
// });

module.exports = router;
