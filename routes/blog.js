var express = require('express')
var models = require('../utils/models')
var parser = require('../utils/parser')
var editRouter = require('./edit')

const DEFAULT_NUM_ITEMS = 10
const MAX_NUM_ITEMS = 30

const Feed = require('feed').Feed;

const FEED_DETAILS = {
  title: 'aadah.me',
  description: 'Writings by Abdi-Hakin Dirie & Ahmed Ali Diriye',
  id: 'https://aadah.me',
  link: 'https://aadah.me',
  language: 'en-US',
  image: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect rx=%2210%22 width=%22100%22 height=%22100%22 fill=%22%23202020%22 /><text x=%220.15em%22 y=%22.95em%22 font-size=%2280%22 fill=%22%23ffffff%22>⚖</text></svg>',
  favicon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect rx=%2210%22 width=%22100%22 height=%22100%22 fill=%22%23202020%22 /><text x=%220.15em%22 y=%22.95em%22 font-size=%2280%22 fill=%22%23ffffff%22>⚖</text></svg>',
  copyright: `Copyright © ${new Date().getFullYear()} by Abdi-Hakin Dirie & Ahmed Ali Diriye`,
  feedLinks: {
    atom: 'https://aadah.me/blog/feed',
    rss: 'https://aadah.me/blog/feed/rss'
  },
  author: {
    name: 'Abdi-Hakin Dirie & Ahmed Ali Diriye',
    link: 'https://aadah.me/about'
  }
};

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
      res.locals.createBlogPost = (post => parser.web.createBlogPost(post))
      res.status(200).render('blog/blog', { posts: posts })
    }
  })
})

function getNumItems(numItems) {
  var num = parseInt(numItems, 10) || DEFAULT_NUM_ITEMS
  return Math.min(num, MAX_NUM_ITEMS)
}

function feedFactory(feedType, numItems) {
  return function (req, res, next) {
    feed = new Feed(FEED_DETAILS)
    models.Post.find({
      public: true
    }, null, {
      limit: getNumItems(numItems)
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
          var result = parser.feed.parse(path, post.manuscript, post)
          feed.addItem({
            title: post.title,
            id: `https://aadah.me${path}`,
            link: `https://aadah.me${path}`,
            description: post.subtitle,
            content: result.html,
            author: [{
              name: post.author,
              link: 'https://aadah.me/about'
            }],
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

router.get('/feed/:feedType(\\D+)?/:numItems(\\d+)?', function (req, res, next) {
  feedFactory((req.params.feedType || 'atom'), req.params.numItems)(req, res, next)
})

// Mount edit routes
router.use('/edit', editRouter)

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
        var result = parser.web.parse(path, post.manuscript, post)
        res.status(200).type('text/html').send(result.html)
      } catch (err) {
        console.log(err);
        res.status(500).render('error/500')
      }
    }
  })
})

router.get('/:postID/manuscript', logView, function (req, res, next) {
  models.Post.findOne({
    _id: req.params.postID,
    public: true
  }, 'manuscript', function (err, post) {
    if (err) {
      res.status(500).render('error/500')
    } else if (!post) {
      res.status(404).render('error/404')
    } else {
      res.status(200).type('text/plain').send(post.manuscript)
    }
  })
})

module.exports = router
