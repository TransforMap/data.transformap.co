const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const session = require('express-session')
const passport = require('passport')
const User = __.require('controllers', '/users/lib/users')
const gitlabStrategy = require('./strategies/gitlab')

// Passport serialize and deserialize user instances to and from the session
passport.serializeUser(function (user, done) {
  const id = user.id || user._id
  _.success(id, 'serializeUser')
  done(null, id)
})

passport.deserializeUser(function (id, done) {
  User.byId(id)
  .then(function (user) {
    _.success(user, 'deserializeUser')
    done(null, user)
  })
  .catch(function (err) {
    _.error(err, 'deserializeUser err')
    done(err)
  })
})

// assign to passport current session a default strategy
passport.use('gitlab', gitlabStrategy.auth)

const redirectionParams = {
  failureRedirect: '/',
  successReturnToOrRedirect: '/user',
  state: CONFIG.get('auth.gitlab.state')
}
const authenticate = passport.authenticate('gitlab', redirectionParams)

function ensureAuthenticated (req, res, next) {
  //technical debt here : req == Id provider request (not client reques), returnTo will be triggered in the redirectionParams, and will redirect to the provider page, which is not the oauth conventionnal behavior.
  //better behavior would be to returnTo client origin, but it cannot be set here. Possible implementation : client request send a query parameter containing url origin of the client, which can be bind to the session before ensureAuthenticated is triggered
  if (req.session.passport && _.isUuid(req.session.passport.user)) {
    next()
  } else {
    req.session.returnTo = req.headers.referer
    authenticate(req, res, next)
  }
}

module.exports = {
  initialize: passport.initialize(),
  session: session,
  authenticate: authenticate,
  ensureAuthenticated: ensureAuthenticated
}
