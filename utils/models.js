var models = {}

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var postSchema = new Schema({
  _id: { // will be post id
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
})

models.Post = mongoose.model('Post', postSchema)

module.exports = models
