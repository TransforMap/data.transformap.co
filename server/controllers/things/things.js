const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const buildController = require('./build_controller')

// Generating the list of contexts names from the files
// available in the models/contexts folder
const extractName = (filename) => filename.split('.')[0]
const folder = __.path('controllers', 'things/models/contexts')
const contextsList = require('fs').readdirSync(folder).map(extractName)

_.log(contextsList, 'contexts')

// HOW TO

// To add a new endpoint, add a new model to server/controllers/things/models/contexts
// with a 'validateData' function, taking a data object as input,
// throwing is something is wrong else returning undefined

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
    get: controller.get,
    put: controller.put,
    delete: controller.delete
  }

  return routes
}
