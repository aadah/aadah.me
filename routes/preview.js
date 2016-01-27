var express = require('express');
var models = require('../utils/models');
var parser = require('../utils/parser');
var auth = require('../utils/auth');

var router = express.Router();

router.get('/:dir', auth.checkAuthentication, function(req, res) {
    models.Post.findOne({
        _id: req.params.dir
    }, function (err, post) {
        if (err) {
            res.status(500).render('error/500');
        } else if (!post) {
            res.status(404).render('error/404');
        } else {
            var result = parser.parse(post._id, post.manuscript, post);
            res.status(200).type('text/html').send(result.html);
        }
    });
});

module.exports = router;
