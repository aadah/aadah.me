var app = require('../app');
var config = require('../utils/config');

app.listen(config.port, function () {
    console.log('Listening on port', config.port);
});
