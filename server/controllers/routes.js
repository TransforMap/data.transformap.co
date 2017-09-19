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
      _passport.ensureAuthenticated,
      function (req, res, next) {
        res.json({ userId: req.session.passport.user })
      }
    ]
  },
  'auth': {
    get: _passport.authenticate
  },
  'logout': {
    get: function (req, res, next) {
      req.session.regenerate(function () {
        req.logout()
        _.success('logging out')
        res.redirect('/')
      })
    }
  }
}

_.extend(routes, things.generateRoutes())
_.extend(routes, users.generateRoutes())
_.extend(routes, root.generateHypermedia(routes))

module.exports = _.log(routes, 'routes')
