const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const contextsList = [ 'place' ]
const buildController = require('./build_controller')

module.exports = {
  generateRoutes: function () {
    const routes = {}
    contextsList.forEach(function (contextName) {
      _.extend(routes, contextRoutes(contextName))
    })
    return routes
  }
}

const contextRoutes = function (contextName) {
  const controller = buildController(contextName)
  const routes = {}
  routes[contextName] = {
    post: controller.post
  }
  routes[`${contextName}/:id`] = {
    get: controller.get
  }
  return routes
}
