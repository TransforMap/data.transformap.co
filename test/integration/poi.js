const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const breq = require('bluereq')
const get = url => breq.get(url).then(_.property('body'))
const post = (url, body) => breq.post(url, body).then(_.property('body'))
const poiNewDoc = require('../fixtures/poi-new-to-create-for-api')
const should = require('should')
const endpoint = CONFIG.server.url() + '/poi'

console.log('url', endpoint)

describe('/poi', function () {
  describe('POST doc', function () {
    it('should return the doc with journal id', function (done) {
      post(endpoint, poiNewDoc)
      .then(function (body) {
        body.ok.should.equal(true)
        _.isUuid(body.id).should.equal(true)
        done()
      })
    })
  })
  describe('GET id', function () {
    it('should be a function', function (done) {
      post(endpoint, poiNewDoc)
      .then(body => get(`${endpoint}/${body.id}`))
      .then(function (body) {
        body.should.be.an.Object()
        body.data.should.be.an.Object()
        _.isUuid(body._id).should.equal(true)
        done()
      })
    })
  })
})
