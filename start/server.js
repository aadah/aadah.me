var mongoose = require('mongoose');
var http_app = require('../http_app');
var https_app = require('../https_app');
var config = require('../utils/config');

mongoose.connect(config.db_connection_string);

// HTTP
http_app.listen(config.http_port, function () {
    console.log('Listening on port', config.http_port);
});

// // HTTPS
// https_app.listen(config.https_port, function () {
//     console.log('Listening on port', config.https_port);
// });
