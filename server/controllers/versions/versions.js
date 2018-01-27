const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')

const controller = require('./versions_controller')
const cntrlr = controller()

module.exports = {
  generateRoutes: function () {
    return {
      'versions': {
        get: cntrlr.all
      },
      'versions/:id': {
        get: cntrlr.get
      },
      'versions/latest/:count': {
        get: cntrlr.latest
      }
    }
  }
}
