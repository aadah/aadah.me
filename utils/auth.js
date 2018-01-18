var auth = {}

var config = require('./config')

auth.login = function (req, res, next) {
  if (req.session.authenticated) {
    res.redirect('/account')
  } else {
    if (req.body.passphrase === config.passphrase) {
      req.session.authenticated = true
      res.redirect('/account')
    } else {
      res.status(403).render('error/403')
    }
  }
}

auth.logout = function (req, res, next) {
  req.session.destroy(function (err) {
    if (err) {
      res.status(500).render('error/500')
    } else {
      res.redirect('/account/login')
    }
  })
}

auth.checkAuthentication = function (req, res, next) {
  if (req.session.authenticated) {
    next()
  } else {
    res.status(403).render('error/403')
  }
}

module.exports = auth
