#!/usr/bin/env node
var app = require('../app');

var config = require('../utils/config');

app.set('port', config.port);

var server = app.listen(app.get('port'), function () {
    console.log('Listening on port', app.get('port'));

    app.db.on('error', console.error.bind(console, 'connection error:'));
    app.db.once('open', function (callback) {
        console.log('Connected established!');
    });
});
