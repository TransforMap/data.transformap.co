const CONFIG = require('config')
const __ = CONFIG.universalPath
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
const breq = require('bluereq')
const User = __.require('controllers', '/users/lib/users')

// from http://www.passportjs.org/docs/oauth :
// The application requests permission from the user for access to protected resources.
// A token is issued to the application, if permission is granted by the user.
// The application authenticates using the token to access protected resources.

const options = {
  authorizationURL: CONFIG.get('auth.gitlab.authorizationURL'),
  tokenURL: CONFIG.get('auth.gitlab.tokenURL'),
  clientID: CONFIG.get('auth.gitlab.clientID'),
  clientSecret: CONFIG.get('auth.gitlab.clientSecret'),
  callbackURL: CONFIG.get('auth.gitlab.callbackURL')
}

callback = function(accessToken, refreshToken, profile, done) {
  // `profile` argument is empty,  Gitlab doesnt make available user profile information. using accessToken endpoint in order to fetch user information
  breq.get( CONFIG.get('auth.gitlab.accessTokenEndpoint') + accessToken )
  .then(function (res) {
    const userInfo = {
      contact: {
        name: res.body.username,
        email: res.body.email,
      },
      auth: {
        provider: res.body.web_url
      }
    }
    User.findOrCreateUser(userInfo)
    .then(function(user){
      done(null, user)
    })
  })
}

const GitlabOAuth2Strategy = new OAuth2Strategy(options, callback)

module.exports = {
  auth: GitlabOAuth2Strategy
}
