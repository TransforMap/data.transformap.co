const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')

module.exports = {
  render: function (req, res) {
    _.log(req, 'render input')
    var routes = _.extend(routes, req)
    for (var e in routes) {
      var keys = Object.keys(routes[e])
      _.log(keys, 'current route keys')
      for (var i in keys) {
        routes[e][keys[i]] = ''
      }
    }
    _.log(routes, 'render output')
    return res.json(routes)
  }
}
