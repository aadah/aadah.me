var express = require('express');
var models = require('../utils/models'),
    Posts = models.Posts,
    Ips = models.Ips;

var router = express.Router();

router.post('/visit', function(req, res) {
    // TODO: Log visitors
    console.log(req.body);
    res.status(200).send();
});

router.post('/visit/post', function(req, res) {
    // TODO: Log visits to specific posts
    console.log(req.body);
    res.status(200).send();
});

module.exports = router;
