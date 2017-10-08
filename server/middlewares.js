const CONFIG = require('config')
const americano = require('americano')
const passport = require('./middlewares/passport')

const cors = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
}

module.exports = {
  common: [
    americano.bodyParser({limit: '50mb'}),
    americano.methodOverride(),
    americano.errorHandler({
      dumpExceptions: true,
      showStack: true
    }),
    cors,
    passport.initialize,
    passport.session({
      cookie: {
        path    : '/',
        httpOnly: true,
        maxAge  : 24*60*60*1000
      },
      secret: CONFIG.get('auth.passportSessionSecret'),
      resave: true,
      saveUninitialized: true, pauseStrea
      : true
    }),
  ],
  development: [
    logger('dev')
  ],
  production: [
    logger('short')
  ]
}
