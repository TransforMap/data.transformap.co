const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const things = require('./things/things')
const users = require('./users/routes.js')
const root = require('./root/root')
const passport = require('passport')
const _passport = require('./../middlewares/passport')

const routes = {
  'hello': {
    get: function (req, res, next) {
      var name = req.query.name || 'you'
      res.json({ hello: name })
    }
  },
  'secretPage': {
    get: function (req, res, next) {
      res.json({ hello: "foo" })
    }
  },
  'auth/gitlab': {
    get: _passport.authentikate
  },
  'auth/gitlab/callback': {
    get: _passport.authentikate
  }
}



_.extend(routes, things.generateRoutes())
_.extend(routes, users.generateRoutes())
_.extend(routes, root.generateHypermedia(routes))

module.exports = _.log(routes, 'routes')
