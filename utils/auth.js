var auth = {};

var config = require('./config');
var crypto = require('./crypto');

auth.login = function (req, res, next) {
    if (req.session.authenticated) {
        res.redirect('/editor');
    } else {
        // res.redirect('/editor');
        // or
        // res.status(403).render('error/403');
    }
};

auth.logout = function (req, res, next) {
    req.session.destroy(function (err) {
        // destroyed if !err
    });
};

auth.checkAuthentication = function (req, res, next) {
    if (req.session.authenticated) {
        next();
    } else {
        res.status(403).render('error/403');
    }
};

module.exports = auth;
