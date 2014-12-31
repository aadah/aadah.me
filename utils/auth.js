var auth = {};

var config = require('./config');
var crypto = require('./crypto');

auth.login = function (req, res) {
    if (!req.session.allowed) {

    } else {
        res.redirect('/editor');
    }
};

auth.logout = function (req, res) {
    req.session.destroy(function (err) {
        // destroyed if !err
    });
};

auth.requireValidation = function (req, res, next) {
    if (req.session.validated) {
        next();
    } else {
        next(new Error('You\'re not allowed access to the editor.'));
    }
};

module.exports = auth;
