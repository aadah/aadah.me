var express = require('express');
var router = express.Router();

router.post('/visit', function(req, res) {
    // TODO: Log visitors
    res.status(200).send();
});

router.post('/visit/post', function(req, res) {
    // TODO: Log visit to specific posts
    res.status(200).send();
});

module.exports = router;
