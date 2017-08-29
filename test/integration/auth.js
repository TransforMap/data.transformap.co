const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')

const it = global.it // for lint
const describe = global.describe // for lint
require('should')

const breq = require('bluereq')
const get = (url) => breq.get(url).then(_.property('body'))
const endpoint = CONFIG.server.url() + '/'

const passport = require('passport'),
  OAuth2Strategy = require('passport-oauth').OAuth2Strategy


describe('/secretPage', function () {
  it('should redirect to provider authentication page', function (done) {
    breq.get(`${endpoint}secretPage`)
    .then(function (body) {
      body.req.path.should.equal("/users/sign_in")
      done()
    })
  })
})
describe('/auth/logout', function () {
  it('it should end the session and show a public page', function (done) {
    breq.get(`${endpoint}auth/logout`)
    .then(function(body) {
      body.req.path.should.equal("/hello")
      done();
    });
  });
});
