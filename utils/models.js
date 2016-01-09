var models = {};

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var postSchema = new Schema({
    _id: { // will be dir name
        type: String,
        required: true
    },
    manuscript: {
        type: String,
        required: true
    },
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
    html: {
        type: String
    },
    public: {
        type: Boolean,
        required: true
    },
    updated: {
        type: Date,
        required: true
    },
    posted: {
        type: Date,
        required: false
    },
    views: {
        type: Number,
        required: false,
        min: 0
    }
});

models.Post = mongoose.model('Post', postSchema);

module.exports = models;
