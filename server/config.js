const americano = require('americano')
const cors = require('./middlewares/cors')

module.exports = {
  common: [
    americano.bodyParser(),
    americano.methodOverride(),
    americano.errorHandler({
      dumpExceptions: true,
      showStack: true
    }),
    cors
  ],
  development: [
    americano.logger('dev')
  ],
  production: [
    americano.logger('short')
  ]
}
