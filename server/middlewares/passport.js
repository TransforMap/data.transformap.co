const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const passport = require('passport')
const BasicStrategy = require('passport-http').BasicStrategy
const user_ = __.require('controllers', 'users/lib/users')

const basicAuthVerify = function (username, password, done) {
  user_.findOneByUsername(username)
  .then(function (user) {
    if (!user) { return done(null, false) }
    if (!user_.verifyPassword(user, password)) { return done(null, false) }
    return done(null, user)
  })
  .catch(done)
}

passport.use(new BasicStrategy(basicAuthVerify))
const authenticate = passport.authenticate('basic', { session: false })

module.exports = {
  initialize: passport.initialize(),
  restrictedRoutes: function (req, res, next) {
    if (isRestrictedRoutes(req)) {
      authenticate(req, res, next)
    } else {
      next()
    }
  }
}

const isRestrictedRoutes = function (req) {
  const pathname = req._parsedUrl.pathname.replace(/^\//, '')
  return _.includes([ 'hello' ], pathname)
}
