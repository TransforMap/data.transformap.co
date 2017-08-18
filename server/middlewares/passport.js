const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const passport = require('passport')
, OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
const user_ = __.require('controllers', 'users/lib/users')

const GitlabOAuth2Strategy = new OAuth2Strategy({
  authorizationURL: 'https://gitlab.com/oauth/authorize',
  tokenURL: 'https://www.gitlab.com/oauth2/token',
  clientID: CONFIG.get('gitlabOAuth.clientID'),
  clientSecret: CONFIG.get('gitlabOAuth.clientSecret'),
  callbackURL: CONFIG.get('gitlabOAuth.callbackURL')
},
function(accessToken, refreshToken, profile, done) {
  user_.findOneByUsername(function(err, user) {
    done(err, user)
  })
})

passport.use('gitlab', GitlabOAuth2Strategy);

const authentikate = passport.authenticate('gitlab')

module.exports = {
  initialize: passport.initialize(),
  session: session,
  authentikate: authentikate,
  restrictedRoutes: function (req, res, next) {
    if (isRestrictedRoutes(req)) {
      authentikate(req, res, next)
    } else {
      next()
    }
  }
}

const isRestrictedRoutes = function (req) {
  const pathname = req._parsedUrl.pathname.replace(/^\//, '')
  return _.includes([ 'secretPage' ], pathname)
}
