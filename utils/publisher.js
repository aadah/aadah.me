var peg = require("pegjs");
var fs = require('fs');

var models = require('./models');
var parser = require('./parser');

var publisher = {};

// Update the post internally (doesn't show changes).
publisher.update = function (dir, callback, manuscript) {
    try {
        // parse manuscript o check it's valid.
        var result = parser.parse(dir, manuscript);
        var post = models.Post({
            manuscript: manuscript,
            updated: Date.now()
        });

        models.Post.update({
            _id: dir
        }, post, {
            upsert: true
        }, callback);
    } catch (err) {
        callback(err);
    }
};

// Display post on the blog page and log when it was published, or make changes public.
publisher.publish = function (dir, callback, manuscript) {
    publisher.update(dir, function (err, raw) {
        if (err) {
            callback(err);
        } else {
            models.Post.findOne({
                _id: dir
            }, function (err, post) {
                if (err) {
                    callback(err);
                } else {
                    var result = parser.parse(post._id, post.manuscript, post);

                    if (!post.posted) {
                        post.posted = post.updated;
                    }

                    post.title = result.title;
                    post.subtitle = result.subtitle;
                    post.author = result.author;
                    post.html = result.html;
                    post.public = true;
                    post.save(callback);
                }
            });
        }
    }, manuscript);
};

// Take down the post from the blog page.
publisher.hide = function (dir, callback) {
    models.Post.findOneAndUpdate({_id: dir}, {
        $set: {public: false}
    }, callback);
};

// Show the post on the blog page.
publisher.show = function (dir, callback) {
    models.Post.findOneAndUpdate({_id: dir}, {
        $set: {public: true}
    }, callback);
};

// Delete the post from the database.
publisher.remove = function (dir, callback) {
    models.Post.findByIdAndRemove(dir, callback);
};

module.exports = publisher;
