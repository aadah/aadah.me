var express = require('express')
var models = require('../utils/models')
var parser = require('../utils/parser')

const Feed = require('feed').Feed;
const feed = new Feed({
  title: 'aadah.me',
  description: 'Writings by Abdi-Hakin Dirie & Ahmed Ali Diriye',
  id: 'https://aadah.me',
  link: 'https://aadah.me',
  language: 'en-US',
  image: 'https://aadah.me/media/images/aadah.png',
  favicon: 'https://aadah.me/favicon.ico',
  copyright: `Copyright © ${new Date().getFullYear()} by Abdi-Hakin Dirie & Ahmed Ali Diriye`,
  feedLinks: {
    atom: 'https://aadah.me/blog/feed'
  },
  author: {
    name: 'Abdi-Hakin Dirie & Ahmed Ali Diriye',
    link: 'https://aadah.me/about'
  }
});

var router = express.Router()

function logView(req, res, next) {
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

function feedFactory(feedType) {
  return function (req, res, next) {
    models.Post.find({
      public: true
    }).select('title subtitle author posted updated manuscript').sort({
      posted: 'desc'
    }).exec(function (err, posts) {
      if (err) {
        res.status(500).render('error/500')
      } else {
        var dates = []
        posts.forEach(post => {
          dates.push(new Date(post.updated))
          var path = `/blog/${post._id}`
          var result = parser.parse(path, post.manuscript, post)
          feed.addItem({
            title: post.title,
            id: `https://aadah.me${path}`,
            link: `https://aadah.me${path}`,
            description: post.subtitle,
            content: result.html,
            author: {
              name: post.author,
              link: 'https://aadah.me/about'
            },
            published: post.posted,
            date: post.updated,
          });
        });
        dates.sort(function (d1, d2) {
          return d1 - d2;
        })
        feed.options.updated = dates.pop()
        var mimeType = `application/${feedType}+xml`
        switch (feedType) {
          case 'atom':
            res.status(200).type(mimeType).send(feed.atom1())
            break;
          case 'rss':
            res.status(200).type(mimeType).send(feed.rss2())
            break;
          default:
            res.status(404).render('error/404')
            break;
        }
      }
    })
  }
}

router.get('/feed', feedFactory('atom'))
router.get('/feed/:feedType', function (req, res, next) {
  feedFactory(req.params.feedType)(req, res, next)
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
        var path = `${req.baseUrl}${req.path}`
        var result = parser.parse(path, post.manuscript, post)
        res.status(200).type('text/html').send(result.html)
      } catch (err) {
        res.status(500).render('error/500')
      }
    }
  })
})

module.exports = router
