const CONFIG = require('config')
require('should')

const breq = require('bluereq')
const endpoint = CONFIG.server.url()
describe('/auth', function () {
  it('should redirect to provider authentication page in the browser - 406 in this testing env', function (done) {
    breq.get(`${endpoint}/auth`)
    .then(function (body) {
      body.req.path.should.equal('/users/sign_in')
      body.statusCode.should.equal(406)
      done()
    })
  })
})
describe('/logout', function () {
  it('should end the session and show a public page', function (done) {
    breq.get(`${endpoint}/logout`)
    .then(function (body) {
      body.statusCode.should.equal(200)
      done()
    })
  })
})
