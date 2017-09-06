const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const session = require('express-session')
const passport = require('passport')
, OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
const User = __.require('controllers', 'users/lib/users')
const breq = require('bluereq')

const GitlabOAuth2Strategy = new OAuth2Strategy({
  authorizationURL: 'https://lab.allmende.io/oauth/authorize',
  tokenURL: 'https://lab.allmende.io/oauth/token',
  clientID: CONFIG.get('gitlabOAuth.clientID'),
  clientSecret: CONFIG.get('gitlabOAuth.clientSecret'),
  callbackURL: CONFIG.get('gitlabOAuth.callbackURL'),
}, function(accessToken, refreshToken, profile, done) {
  // smell: `profile` should be filled with user info, instead requesting user info through accessToken endpoint
  accessTokenEndpoint = "https://lab.allmende.io/api/v3/user?access_token="
  breq.get( accessTokenEndpoint + accessToken )
  .then(function (res) {
    const userInfo = {
      name: res.body.username,
      email: res.body.email,
      provider: res.body.web_url
    }
    User.findOrCreateUser(userInfo, done)
  })
})

passport.serializeUser(function(user, done) {
  _.success(id = user.journal, 'serializeUser')
  done(null, id)
})

passport.deserializeUser(function(id, done) {
  User.byId(id)
  .then(function(user){
    done(null, user)
  })
  .catch(function(err){
    _.error(err, 'deserializeUser err')
    done(err)
  })
})

passport.use('gitlab', GitlabOAuth2Strategy);

const authenticate = passport.authenticate('gitlab', { failureRedirect: '/' })

function successRedirect(req, res, next) {
  res.redirect('/secretPage')
}

function ensureAuthenticated(req, res, next) {
  req.session.passport ? next() : res.redirect('auth/gitlab')
}

module.exports = {
  initialize: passport.initialize(),
  session: session,
  authenticate: authenticate,
  ensureAuthenticated: ensureAuthenticated,
  successRedirect: successRedirect
}

