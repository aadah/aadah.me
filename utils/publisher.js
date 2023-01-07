var models = require('./models')
var parser = require('./parser')

var publisher = {}

// Save the post. If post is already public then changes will be live on site.
publisher.save = function (postID, callback, manuscript) {
  try {
    var result = parser.parse(`/blog/${postID}`, manuscript)

    var post = models.Post({
      title: result.title,
      subtitle: result.subtitle,
      author: result.author,
      manuscript: manuscript,
      updated: Date.now()
    })

    models.Post.update({ _id: postID }, post, { upsert: true }, callback)
  } catch (err) {
    callback(err)
  }
}

// Make post live on site. If done for first time, sets posted date.
publisher.publish = function (postID, callback, manuscript) {
  publisher.save(postID, function (err, raw) {
    if (err) {
      callback(err)
    } else {
      models.Post.findOne({ _id: postID }, function (err, post) {
        if (err) {
          callback(err)
        } else {
          if (!post.posted) {
            post.posted = post.updated
          }
          post.public = true
          post.save(callback)
        }
      })
    }
  }, manuscript)
}

// Show the post on the blog page.
publisher.reveal = function (postID, callback) {
  models.Post.findOneAndUpdate({ _id: postID }, {
    $set: { public: true }
  }, callback)
}

// Take down the post from the blog page.
publisher.hide = function (postID, callback) {
  models.Post.findOneAndUpdate({ _id: postID, public: true }, {
    $set: { public: false }
  }, callback)
}

// Delete the post from the database.
publisher.delete = function (postID, callback) {
  models.Post.findByIdAndRemove(postID, callback)
}

module.exports = publisher
