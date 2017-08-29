const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const things = require('./things/things')
const users = require('./users/routes.js')
const root = require('./root/root')
const _passport = require('./../middlewares/passport')

const routes = {
  'hello': {
    get: function (req, res, next) {
      var name = req.query.name || 'you'
      res.json({ hello: name })
    }
  },
  'secretPage': {
    get: [
      ensureAuthenticated,
      function(req, res, next) {
        res.json({ userId: req.session.passport.user })
      }
    ]
  },
  'auth/gitlab': {
    get: _passport.authentikate
  },
  'auth/gitlab/callback': {
    get: [
      _passport.authentikate,
      function(req, res, next) {
        _passport.successRedirect(req, res, next)
      }
    ]
  },
  'auth/logout': {
    get: function(req, res, next) {
      console.log('logging out')
      req.session.regenerate(function(){
        req.logout()
        res.redirect('/hello')
      })
    }
  }
}

_.extend(routes, things.generateRoutes())
_.extend(routes, users.generateRoutes())
_.extend(routes, root.generateHypermedia(routes))

module.exports = _.log(routes, 'routes')

function ensureAuthenticated(req, res, next) {
  req.session.passport ? next() : res.redirect('auth/gitlab')
}
