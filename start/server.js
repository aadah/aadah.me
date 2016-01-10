var https = require('https');
var app = require('../app');
var config = require('../utils/config');

var server = https.createServer(config.creds, app);
server.listen(config.https_port, function() {
    console.log('Listening on port', config.https_port);
});

app.listen(config.http_port, function () {
    console.log('Listening on port', config.http_port);
});
