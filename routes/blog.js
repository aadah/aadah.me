var express = require('express');
var models = require('../utils/models');
var parser = require('../utils/parser');
var auth = require('../utils/auth');

var router = express.Router();

function logView(req, res, next) {
    models.Post.findOneAndUpdate({
        _id: req.params.dir,
        public: true
    }, {
        $inc: {views: 1}
    }, function (err, post) {
        next();
    });
}

router.get('/', function(req, res, next) {
    models.Post.find({
        public: true
    }).select('title subtitle author posted').sort({
        posted: 'desc'
    }).exec(function (err, posts) {
        if (err) {
            res.status(500).send();
        } else {
            res.locals.createBlogPost = parser.createBlogPost;
            res.status(200).render('main/blog', {posts: posts});
        }
    });
});

router.get('/:dir', logView, function(req, res, next) {
    models.Post.findOne({
        _id: req.params.dir,
        public: true
    }, 'html', function (err, post) {
        if (err) {
            res.status(500).render('error/500');
        } else if (!post) {
            res.status(404).render('error/404');
        } else {
            res.status(200).type('text/html').send(post.html);
        }
    });
});

// router.get('/:dir/manuscript', auth.checkAuthentication, function(req, res, next) {
//     models.Post.findOne({
//         _id: req.params.dir,
//         public: true
//     }, 'manuscript', function (err, post) {
//         if (err) {
//             res.status(500).render('error/500');
//         } else if (!post) {
//             res.status(404).render('error/404');
//         } else {
//             res.status(200).type('text/plain').send(post.manuscript);
//         }
//     });
// });

module.exports = router;
