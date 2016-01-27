var peg = require("pegjs");
var fs = require('fs');

var models = require('./models');
var parser = require('./parser');

var publisher = {};

publisher.update = function (dir, callback, manuscript) {
    try {
        var result = parser.parse(dir, manuscript);

        var post = models.Post({
            manuscript: manuscript,
            title: result.title,
            subtitle: result.subtitle,
            author: result.author,
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

publisher.publish = function (dir, callback, manuscript) {
    publisher.update(dir, function (err, raw) {
        if (err) {
            callback(err);
        } else {
            models.Post.findOne({
                _id: dir
            }, 'public posted updated manuscript', function (err, post) {
                if (err) {
                    callback(err);
                } else {
                    if (!post.posted) {
                        post.posted = post.updated;
                    }
                    post.html = parser.parse(post._id, post.manuscript, post).html;
                    post.public = true;
                    post.save(callback);
                }
            });
        }
    }, manuscript);
};

publisher.hide = function (dir, callback) {
    models.Post.findOneAndUpdate({_id: dir}, {
        $set: {public: false}
    }, callback);
};

publisher.show = function (dir, callback) {
    models.Post.findOneAndUpdate({_id: dir}, {
        $set: {public: true}
    }, callback);
};

publisher.remove = function (dir, callback) {
    models.Post.findByIdAndRemove(dir, callback);
};

module.exports = publisher;
