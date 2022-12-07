var express = require('express')
var models = require('../utils/models')
var parser = require('../utils/parser')

var router = express.Router()

function logView (req, res, next) {
  models.Post.findOneAndUpdate({
    _id: req.params.postID,
    public: true
  }, {
    $inc: { views: 1 }
  }, function (err, post) {
    if (err) {
      res.status(500).render('error/500')
    }
    next()
  })
}

router.get('/', function (req, res, next) {
  models.Post.find({
    public: true
  }).select('title subtitle author posted').sort({
    posted: 'desc'
  }).exec(function (err, posts) {
    if (err) {
      res.status(500).render('error/500')
    } else {
      res.locals.createBlogPost = parser.createBlogPost
      res.status(200).render('main/blog', { posts: posts })
    }
  })
})

router.get('/:postID', logView, function (req, res, next) {
  models.Post.findOne({
    _id: req.params.postID,
    public: true
  }, 'manuscript posted updated', function (err, post) {
    if (err) {
      res.status(500).render('error/500')
    } else if (!post) {
      res.status(404).render('error/404')
    } else {
      try {
        var result = parser.parse(post._id, post.manuscript, post)
        res.status(200).type('text/html').send(result.html)
      } catch (err) {
        res.status(500).render('error/500')
      }
    }
  })
})

module.exports = router
