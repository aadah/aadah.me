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
        unique: true
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

models.Posts = mongoose.model(config.db_posts, postsSchema);
models.Ips = mongoose.model(config.db_ips, ipsSchema);

module.exports = models;
