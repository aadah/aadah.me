var mongoose = require('mongoose')
var app = require('../app')
var config = require('../utils/config')

mongoose.connect(config.db_connection_string)

app.listen(config.port, function () {
  console.log('Listening on port', config.port)
})
