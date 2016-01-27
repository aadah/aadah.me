var fs = require('fs');
var express = require('express');
var auth = require('../utils/auth');

var router = express.Router();

router.get('/', auth.checkAuthentication, function(req, res) {
    res.status(200).render('account/home');
});

router.get('/login', function(req, res, next) {
    if (req.session.authenticated) {
        res.redirect('/account');
    } else {
        res.status(200).render('account/login');
    }
});

router.get('/editor', auth.checkAuthentication, function(req, res) {
    res.status(200).render('account/editor');
});

router.post('/login', auth.login);
// router.post('/logout', auth.logout);
router.get('/logout', auth.logout);

module.exports = router;
