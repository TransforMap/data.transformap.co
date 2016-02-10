const CONFIG = require('config')
require('colors')
console.log('config'.green, CONFIG)

const americano = require('americano')

americano.start(CONFIG.server, function (err, app, server) {
  if (err) {
    console.error('err', err)
  } else {
    console.log('server started!!!'.green)
  }
})
