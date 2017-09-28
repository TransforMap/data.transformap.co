const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const express = require('express')
const { env } = CONFIG
const { name, host, port } = CONFIG.server

const middlewares = require('./middlewares')
const middlewaresList = middlewares.common.concat(middlewares[env] || [])

const routes = require('./controllers/routes')

module.exports = function () {
  app = express()

  // Initialize middlewares
  middlewaresList.forEach(middleware => app.use(middleware))

  // Initialize routes
  Object.keys(routes).forEach(endpoint => {
    const controllers = routes[endpoint]
    Object.keys(controllers).forEach(verb => {
      const controller = controllers[verb]
      app[verb](`/${endpoint}`, controller)
    })
  })

  // Start the server
  return new Promise((resolve, reject) => {
    app.listen(port, host, err => {
      if (err) {
        reject(err)
      } else {
        _.info(`${name} server is listening on port ${port}...`)
        resolve(app)
      }
    })
  })
}
