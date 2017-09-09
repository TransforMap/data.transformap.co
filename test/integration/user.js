const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')

const it = global.it // for lint
const describe = global.describe // for lint
require('should')

const breq = require('bluereq')
const endpoint = CONFIG.server.url() + '/users'
const userNewDoc = require('../fixtures/user-new-to-create-for-api')

describe('/users', function () {
  describe('GET doc', function () {
    it('should return the doc id', function (done) {
      breq.post(endpoint, userNewDoc)
      .then(_.property('body'))
      .then(function (body) {
        const userId = body.id
        breq.get(`${endpoint}/${userId}`)
        .then(function (body) {
          _.isUuid(userId).should.equal(true)
          done()
        })
      })
    })
  })
  describe('POST doc', function () {
    it('should return the doc id', function (done) {
      breq.post(endpoint, userNewDoc)
      .then(_.property('body'))
      .then(function (body) {
        body.ok.should.equal(true)
        _.isUuid(body.id).should.equal(true)
        done()
      })
    })
    it('should return a 400 on invalid doc', function (done) {
      const invalidNewDoc = {
        so: 'much',
        invalid: true
      }
      breq.post(endpoint, invalidNewDoc)
      .then(function (res) {
        res.statusCode.should.equal(400)
        done()
      })
    })
  })
})
