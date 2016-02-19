const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const americano = require('americano')
const initDatabases = __.require('db', 'init')

initDatabases()
.then(function () {
  americano.start(CONFIG.server, function (err, app, server) {
    if (err) {
      _.error(err, 'init err')
    } else {
      _.success('server started!!!')
    }
  })
})