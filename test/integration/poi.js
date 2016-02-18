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
        console.log(body)
        done()
      })
    })
  })
  describe('GET id', function () {
    it('should should return the same ', function (done) {
      post(endpoint, poiNewDoc)
      .then(body => {console.log('fetching id: ' + body.id); return body})
      .then(function (body1) {
        get(`${endpoint}/${body1.id}`)
        .then(function (body2) {
          body2.should.be.an.Object()
          console.log('return value is an object')
          body2.data.should.be.an.Object()
          console.log('return value has an object member "data"')
          _.isUuid(body2._id).should.equal(true)
          console.log('return value has a valid UUID')
          body2._id.should.equal(body1.id)
          console.log('return value\'s UUID is the same as requested')
          b = JSON.stringify(poiNewDoc)
          a = JSON.stringify(body2.data)
          //console.log(a)
          //console.log(b)
          a.should.equal(b) 
          console.log('returned data is the same as posted')
          body2.author.should.be.a.String()
          console.log('object has author')
          body2.timestamp.should.be.a.Number()
          console.log('object has timestamp that is a number')
          done()
        })
      })
    })
  })
})
