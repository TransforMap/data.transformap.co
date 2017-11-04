const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const buildController = require('./build_controller')

// Generating the list of type-names from the files
// available in the models/types folder
const extractName = (filename) => filename.split('.')[0]
const folder = __.path('controllers', 'things/models/types')
const typesList = require('fs').readdirSync(folder).map(extractName)

const _passport = require('../../middlewares/passport')

_.log(typesList, 'types')

// HOW TO

// To add a new endpoint, add a new model to server/controllers/things/models/types
// with a 'validateData' function, taking a data object as input,
// throwing is something is wrong else returning undefined

module.exports = {
  generateRoutes: function () {
    const routes = {}
    typesList.forEach(function (typeName) {
      _.extend(routes, typeRoutes(typeName))
    })
    return routes
  }
}

const typeRoutes = function (typeName) {
  const controller = buildController(typeName)
  const routes = {}

  routes[typeName] = {
    post: [ _passport.ensureAuthenticated, controller.post ]
  }
  routes[`${typeName}/:id`] = {
    get: controller.get,
    put: [ _passport.ensureAuthenticated, controller.put ],
    delete: [ _passport.ensureAuthenticated, controller.delete ]
  }

  return routes
}
