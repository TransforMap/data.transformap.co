const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')

const controllerBuilder = require('./build_controller')
const controller = controllerBuilder()

module.exports = {


  generateRoutes: function () {
    return {
      'versions': {
        get: controller.all
      },
      'versions/:id': {
        get: controller.get
      },
      'versions/latest/:count': {
        get: controller.latest
      },
      'versions/since/:pointInTime': {
        get: controller.latestSince
      }
    }
  }
}
