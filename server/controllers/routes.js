const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const things = require('./things/things')
const root = require('./root/root')
const versions = require('./versions/versions')

const routes = {
  'hello': {
    get: function (req, res, next) {
      var name = req.query.name || 'you'
      res.json({ hello: name })
    }
  }
}

_.extend(routes, things.generateRoutes())
_.extend(routes, versions.generateRoutes())
_.extend(routes, root.generateHypermedia(routes))

module.exports = _.log(routes, 'routes')
