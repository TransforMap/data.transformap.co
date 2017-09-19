const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const session = require('express-session')
const passport = require('passport')
const User = __.require('controllers', '/users/lib/users')
const gitlabStrategy = require('./strategies/gitlab')

passport.serializeUser(function (user, done) {
  const id = user._id
  _.success(id, 'serializeUser')
  done(null, id)
})

passport.deserializeUser(function (id, done) {
  User.byId(id)
  .then(function (user) {
    done(null, user)
  })
  .catch(function (err) {
    _.error(err, 'deserializeUser err')
    done(err)
  })
})

passport.use('gitlab', gitlabStrategy.auth)

const authenticate = passport.authenticate('gitlab', { failureRedirect: '/', successReturnToOrRedirect: '/' })

function ensureAuthenticated (req, res, next) {
  if (req.session.passport) {
    next()
  } else {
    req.session.returnTo = req.originalUrl || req.url
    authenticate(req, res, next)
  }
}

module.exports = {
  initialize: passport.initialize(),
  session: session,
  authenticate: authenticate,
  ensureAuthenticated: ensureAuthenticated
}
