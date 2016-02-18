const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')

const it = global.it // for lint
const describe = global.describe // for lint
require('should')

const breq = require('bluereq')
const get = (url) => breq.get(url).then(_.property('body'))
const post = (url, body) => breq.post(url, body).then(_.property('body'))
const poiNewDoc = require('../fixtures/poi-new-to-create-for-api')
const endpoint = CONFIG.server.url() + '/poi'


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
  describe('GET id', function () {
    it('should get the right document', function (done) {
      post(endpoint, poiNewDoc)
      .then(function (body1) {
        get(`${endpoint}/${body1.id}`)
        .then(function (body2) {
          body2.should.be.an.Object()
          body2.properties.should.be.an.Object()
          _.isUuid(body2._id).should.equal(true)
          body2._id.should.equal(body1.id)
          // coying the id to make comparission simpler
          poiNewDoc._id = body2._id
          const b = JSON.stringify(poiNewDoc)
          const a = JSON.stringify(body2)
          a.should.equal(b)
          done()
        })
      })
    })
  })
})
