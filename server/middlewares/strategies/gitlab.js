const CONFIG = require('config')
const __ = CONFIG.universalPath
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
const breq = require('bluereq')
const User = __.require('controllers', '/users/lib/users')

const GitlabOAuth2Strategy = new OAuth2Strategy({
  authorizationURL: CONFIG.get('auth.gitlab.authorizationURL'),
  tokenURL: CONFIG.get('auth.gitlab.tokenURL'),
  clientID: CONFIG.get('auth.gitlab.clientID'),
  clientSecret: CONFIG.get('auth.gitlab.clientSecret'),
  callbackURL: CONFIG.get('auth.gitlab.callbackURL'),
}, function(accessToken, refreshToken, profile, done) {
  // `profile` argument is empty,  Gitlab doesnt make available user profile information. using accessToken endpoint in order to fetch user information
  accessTokenEndpoint = "https://lab.allmende.io/api/v3/user?access_token="
  breq.get( accessTokenEndpoint + accessToken )
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
})

module.exports = {
  auth: GitlabOAuth2Strategy
}
