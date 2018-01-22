var models = require('./models')
var parser = require('./parser')

var publisher = {}

// Save the post internally (doesn't show changes).
publisher.save = function (dir, callback, manuscript) {
  try {
    // parse manuscript to check it's valid.
    parser.parse(dir, manuscript)

    var post = models.Post({
      manuscript: manuscript,
      updated: Date.now()
    })

    models.Post.update({_id: dir}, post, {upsert: true}, callback)
  } catch (err) {
    callback(err)
  }
}

// Display post on the blog page and log when it was published, or make changes public.
publisher.publish = function (dir, callback, manuscript) {
  publisher.save(dir, function (err, raw) {
    if (err) {
      callback(err)
    } else {
      models.Post.findOne({_id: dir}, function (err, post) {
        if (err) {
          callback(err)
        } else {
          var result = parser.parse(post._id, post.manuscript, post)

          if (!post.posted) {
            post.posted = post.updated
          }

          post.title = result.title
          post.subtitle = result.subtitle
          post.author = result.author
          post.html = result.html
          post.public = true
          post.save(callback)
        }
      })
    }
  }, manuscript)
}

function fixHelper (post, callback) {
  var result = parser.parse(post._id, post.manuscript, post)

  post.html = result.html
  post.save(callback)
}

// Fix the headers of a public post
publisher.fix = function (dir, callback, manuscript) {
  models.Post.findOne({_id: dir, public: true}, function (err, post) {
    if (err) {
      callback(err)
    } else {
      fixHelper(post, callback)
    }
  })
}

// Show the post on the blog page.
publisher.reveal = function (dir, callback) {
  models.Post.findOneAndUpdate({_id: dir}, {
    $set: {public: true}
  }, callback)
}

// Take down the post from the blog page.
publisher.hide = function (dir, callback) {
  models.Post.findOneAndUpdate({_id: dir, public: true}, {
    $set: {public: false}
  }, callback)
}

// Delete the post from the database.
publisher.delete = function (dir, callback) {
  models.Post.findByIdAndRemove(dir, callback)
}

// Fix all public posts at once (usually to update headers)
publisher.batch = function (dir, callback) {
  models.Post.find({public: true}, function (err, posts) {
    if (err) {
      callback(err)
    } else {
      for (var i = 0; i < posts.length; i++) {
        var post = posts[i]
        var errs = []

        fixHelper(post, function (err2) {
          if (err2) {
            errs.push(err2)
          }
        })
      }

      setTimeout(function () {
        callback(errs)
      }, 10000)
    }
  })
}

module.exports = publisher
