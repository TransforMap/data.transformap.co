const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const error_ = __.require('lib', 'error')
const hypermedia = require('./lib/hypermedia')

module.exports = {
  generateHypermedia: function (routes) {
    return {
      '': {
        get: function (req, res) {
          _.log(routes, 'raw routes')
          hypermedia.render(routes, res)
          // .then(res.json.bind(res))
          // .catch(error_.Handler(res))
        }
      }
    }
  }
}
