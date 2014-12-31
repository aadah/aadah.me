var models = {};

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var config = require('./config');

var postsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    posted: {
        type: Date,
        required: true
    },
    views: {
        type: Number,
        min: 0,
        default:0
    },
    dir: {
        type: String,
        required: true
    }
});

var ipsSchema = new Schema({
    ip: {
        type: String,
        required: true,
        unique: true,
        match: /^((25[0-5]|2[0-4][0-9]|[01]?[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9]{1,2})$/
    },
    views: {
        type: Number,
        min: 0,
        default: 0
    },
    last: {
        type: Date,
        required: true
    },
});

models.Posts = mongoose.model(config.posts, postsSchema);
models.Ips = mongoose.model(config.ips, ipsSchema);

module.exports = models;
