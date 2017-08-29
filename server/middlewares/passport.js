const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const session = require('express-session')
const passport = require('passport')
, OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
const user_ = __.require('controllers', 'users/lib/users')
const breq = require('bluereq')

const GitlabOAuth2Strategy = new OAuth2Strategy({
  authorizationURL: 'https://lab.allmende.io/oauth/authorize',
  tokenURL: 'https://lab.allmende.io/oauth/token',
  clientID: CONFIG.get('gitlabOAuth.clientID'),
  clientSecret: CONFIG.get('gitlabOAuth.clientSecret'),
  callbackURL: CONFIG.get('gitlabOAuth.callbackURL'),
}, function(accessToken, refreshToken, profile, done) {
  // Problematic empty user profile from la.allmende.io
  console.log("profile", profile)
  // User mock to be deleted
  done(null, {id:2})
})

passport.serializeUser(function(user, done) {
  _.success(id = user.id, 'serializeUser')
  done(null, id)
})

passport.deserializeUser(function(id, done) {
  user_.byId(id)
  .then(function(user){
    done(null, user)
  })
  .catch(function(err){
    _.error(err, 'deserializeUser err')
    done(err)
  })
})

passport.use('gitlab', GitlabOAuth2Strategy);

const authentikate = passport.authenticate('gitlab', { failureRedirect: '/' })

function successRedirect(req, res, next) {
  res.redirect('/secretPage')
}

module.exports = {
  initialize: passport.initialize(),
  session: session,
  authentikate: authentikate,
  successRedirect: successRedirect
}