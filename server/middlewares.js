const logger = require('morgan')
const CONFIG = require('config')
const passport = require('./middlewares/passport')

const cors = function (req, res, next) {
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Origin', req.headers.origin)
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept')
  if ('OPTIONS' == req.method) {
    res.send(200)
  } else {
    next()
  }
}


module.exports = {
  common: [
    require('body-parser').json(),
    require('method-override')(),
    require('errorhandler')({ dumpExceptions: true, showStack: true }),
    cors,
    passport.initialize,
    passport.session({
      cookie: {
        path    : '/',
        httpOnly: true,
        maxAge  : 30*24*60*60*1000,
        domain  : 'allmende.io'
      },
      secret: CONFIG.get('auth.passportSessionSecret'),
      resave: true,
      saveUninitialized: true,
      pauseStream: true
    })
  ],
  development: [
    logger('dev')
  ],
  production: [
    logger('short')
  ]
}
