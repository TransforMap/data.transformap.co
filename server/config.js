const americano = require('americano')
const cors = require('./middlewares/cors')
const passport = require('./middlewares/passport')

module.exports = {
  common: [
    americano.bodyParser(),
    americano.methodOverride(),
    americano.errorHandler({
      dumpExceptions: true,
      showStack: true
    }),
    cors,
    passport.initialize,
    passport.restrictedRoutes
  ],
  development: [
    americano.logger('dev')
  ],
  production: [
    americano.logger('short')
  ]
}
