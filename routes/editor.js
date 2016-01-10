var fs = require('fs');
var express = require('express');
var auth = require('../utils/auth');

var router = express.Router();

router.get('/editor', auth.checkAuthentication, function(req, res) {
    res.status(200).render('editor/editor');
});

router.get('/login', function(req, res, next) {
    if (req.session.authenticated) {
        res.redirect('/editor');
    } else {
        res.status(200).render('editor/login');
    }
});

router.post('/login', auth.login);
router.post('/logout', auth.logout);

module.exports = router;
