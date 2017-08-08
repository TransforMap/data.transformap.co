const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')

require('should')

const breq = require('bluereq')
const get = (url) => breq.get(url).then(_.property('body'))
const post = (url, body) => breq.post(url, body).then(_.property('body'))
const put = (url, body) => breq.put(url, body).then(_.property('body'))
const delete_ = (url) => breq.delete(url).then(_.property('body'))

const endpoint = CONFIG.server.url() + '/media'
const mediaNewURL = require('../fixtures/media-new-url.json')
const mediaNewIPFS = require('../fixtures/media-new-ipfs.json')
const mediaNewBLOB = '../fixtures/SDvision_MN00097-intermediate-DMs1p36833449a6size0_0005.jpg'

describe('/media', function () {
  describe('POST url', function () {
    it('should return metadata with journal id, assetUrl', function (done) {
      post(endpoint, mediaNewURL)
      .then(function (body) {
        body.ok.should.equal(true)
        _.isUuid(body.id).should.equal(true)
        _.isNonEmptyString(body.assetUrl)
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
  describe('POST ipfs metadata', function () {
    it('should return metadata with journal id, assetUrl, ipfs hash and mimetype', function (done) {
      post(endpoint, mediaNewIPFS)
      .then(function (body) {
        body.ok.should.equal(true)
        _.isUuid(body.id).should.equal(true)
        body.mimetype.should.equal('image/jpeg')
        body.ipfs.should.equal('QmVXmy59f5QqKDGyhpHbRiGnba5SfHaooDPCWhd8Xtgwz2')
        _.isNonEmptyString(body.assetUrl).should.equal(true)
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
  describe('POST image', function () {
    it('should return metadata with journal id, assetUrl, ipfs hash and mimetype', function (done) {
      post(endpoint, mediaNewBLOB)
      .then(function (body) {
        body.ok.should.equal(true)
        _.isUuid(body.id).should.equal(true)
        body.mimetype.should.equal('image/jpeg')
        body.ipfs.should.equal('QmbLbqp41tVPVjQoVvAXKBehWsZ4k16mRu7m9wv3hLPSuK')
        _.isNonEmptyString(body.assetUrl).should.equal(true)
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

  // TODO: update tests below to media case

  describe('GET id', function () {
    it('should return the same object via GET that is pushed previously via POST', function (done) {
      post(endpoint, mediaNewURL)
      .then(function (body1) {
        get(`${endpoint}/${body1.id}`)
        .then(function (body2) {
          body2.should.be.an.Object()
          body2.properties.should.be.an.Object()
          _.isUuid(body2._id).should.equal(true)
          body2._id.should.equal(body1.id)
          // copying the id to make comparison simpler
          mediaNewURL._id = body2._id
          const b = JSON.stringify(mediaNewURL)
          const a = JSON.stringify(body2)
          if (a !== b) {
            _.log('posted', a)
            _.log('returned', b)
          }
          a.should.equal(b)
          done()
        })
      })
    })
  })
  describe('UPDATE id', function () {
    it('should accept a correct object for update', function (done) {
      post(endpoint, mediaNewURL)
      .then(function (body1) {
        mediaNewURL.properties.name += ' - Version 2'
        put(`${endpoint}/${body1.id}`, mediaNewURL)
        .then(function (retVal) {
          retVal.ok.should.equal(true)
          done()
        })
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
    it('should return the new version after update', function (done) {
      post(endpoint, mediaNewURL)
      .then(function (body1) {
        mediaNewURL.properties.name += ' - Version 2'
        put(`${endpoint}/${body1.id}`, mediaNewURL)
//        .then(_.Log('retval of update command'))
        .then(function (body2) {
          get(`${endpoint}/${body2.id}`)
//          .then(_.Log('retval of get command'))
          .then(function (body3) {
//            console.log(body3)
            body3.should.be.an.Object()
            body3.properties.should.be.an.Object()
            _.isUuid(body3._id).should.equal(true)
            body3._id.should.equal(body2.id)
            // copying the id to make comparison simpler
            mediaNewURL._id = body3._id
            const b = JSON.stringify(mediaNewURL)
            const a = JSON.stringify(body3)
            a.should.equal(b)
            done()
          })
        })
      })
    })
  })
  describe('DELETE id', function () {
    it('should add the deleted flag to supplied UUID', function (done) {
      post(endpoint, mediaNewURL)
      .then(function (body1) {
        delete_(`${endpoint}/${body1.id}`)
        .then(function (deleteAnswer) {
          deleteAnswer.ok.should.equal(true)
          get(`${endpoint}/${deleteAnswer.id}`)
          .then(function (body2) {
            body2._deleted.should.equal(true)
            done()
          })
        })
      })
    })
    it('should return 208 if the UUID is already deleted', function (done) {
      post(endpoint, mediaNewURL)
      .then(function (body1) {
        delete_(`${endpoint}/${body1.id}`)
        .then(function (deleteAnswer1) {
          breq.delete(`${endpoint}/${deleteAnswer1.id}`)
          .then(function (deleteAnswer2) {
            deleteAnswer2.statusCode.should.equal(208) // "already reported", borrowed from WebDAV
            done()
          })
        })
      })
    })
    it('should return 404 if the UUID is not there', function (done) {
      breq.delete(`${endpoint}/3f99cbbccb02d48b595c369a00000000`)
      .then(function (deleteAnswer) {
        deleteAnswer.statusCode.should.equal(404)
        done()
      })
    })
  })
})
