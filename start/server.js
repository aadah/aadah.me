var mongoose = require('mongoose')
var httpApp = require('../http_app')
var httpsApp = require('../https_app')
var config = require('../utils/config')

mongoose.connect(config.db_connection_string)

// HTTP
httpApp.listen(config.http_port, function () {
  console.log('Listening on port', config.http_port)
})

// // HTTPS
// httpsApp.listen(config.https_port, function () {
//   console.log('Listening on port', config.https_port)
// })
