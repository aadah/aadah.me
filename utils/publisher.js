var models = require('./models')
var parser = require('./parser')

var publisher = {}

// Save the post. If post is already public then changes will be live on site.
publisher.save = function (dir, callback, manuscript) {
  try {
    var result = parser.parse(dir, manuscript)

    var post = models.Post({
      title: result.title,
      subtitle: result.subtitle,
      author: result.author,
      manuscript: manuscript,
      updated: Date.now()
    })

    models.Post.update({ _id: dir }, post, { upsert: true }, callback)
  } catch (err) {
    callback(err)
  }
}

// Make post live on site. If done for first time, sets posted date.
publisher.publish = function (dir, callback, manuscript) {
  publisher.save(dir, function (err, raw) {
    if (err) {
      callback(err)
    } else {
      models.Post.findOne({ _id: dir }, function (err, post) {
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
publisher.reveal = function (dir, callback) {
  models.Post.findOneAndUpdate({ _id: dir }, {
    $set: { public: true }
  }, callback)
}

// Take down the post from the blog page.
publisher.hide = function (dir, callback) {
  models.Post.findOneAndUpdate({ _id: dir, public: true }, {
    $set: { public: false }
  }, callback)
}

// Delete the post from the database.
publisher.delete = function (dir, callback) {
  models.Post.findByIdAndRemove(dir, callback)
}

module.exports = publisher
